// ❌ REMOVE dotenv completely (Render doesn't need it)

// import dotenv from "dotenv";
// dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import { createClient } from "@supabase/supabase-js";

import { supabaseAdmin } from "./supabase.js";
import { authenticate } from "./authMiddleware.js";

/* ================= DEBUG ENV (VERY IMPORTANT) ================= */

console.log("ENV DEBUG:", {
  url: process.env.SUPABASE_URL,
  key: process.env.SUPABASE_ANON_KEY?.slice(0, 10),
});

/* ================= SUPABASE CLIENT ================= */

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

console.log("ANON KEY:", process.env.SUPABASE_ANON_KEY?.slice(0, 10));

/* ================= EXPRESS SETUP ================= */

const app = express();

app.use(helmet());
app.use(cors({ origin: true }));
app.use(express.json());

/* ================= HEALTH ================= */

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

/* ================= AUTH MAGIC LINK ================= */

app.post("/auth/email", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: process.env.EMAIL_REDIRECT }
    });

    if (error) {
      console.error("OTP error:", error);
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: "Magic link sent" });

  } catch (err) {
    console.error("Auth error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ================= CONTACT US ================= */

app.post("/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { error } = await supabaseAdmin
      .from("contact_messages")
      .insert([{ name, email, subject, message }]);

    if (error) {
      console.error("Contact insert error:", error);
      return res.status(500).json({ error: "Failed to submit message" });
    }

    res.status(201).json({ message: "Message sent successfully" });
  } catch (err) {
    console.error("Contact error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ================= GET EVENTS ================= */

app.get("/events", async (_req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("events")
      .select("*")
      .eq("is_published", true)
      .order("start_time", { ascending: true });

    if (error) throw error;

    res.json(data);

  } catch (err) {
    console.error("Events fetch error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/events/my", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabaseAdmin
      .from("events")
      .select("*")
      .eq("created_by", userId)
      .order("start_time", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(data);

  } catch (err) {
    console.error("My events error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ================= GET SINGLE EVENT ================= */

app.get("/events/:id", async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("events")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error) throw error;

    res.json(data);

  } catch {
    res.status(404).json({ error: "Event not found" });
  }
});

app.post("/events", authenticate, async (req, res) => {
  try {
    const { title, description, date, time, location } = req.body;
    const userId = req.user.id;

    // 🔥 CHECK ROLE
    const { data: profile, error: roleError } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (roleError || !profile) {
      return res.status(403).json({ error: "Profile not found" });
    }

    if (!["club", "admin"].includes(profile.role)) {
      return res.status(403).json({
        error: "Only club or admin can create events"
      });
    }

    if (!title || !date || !time || !location) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const start_time = new Date(`${date}T${time}`);
    const end_time = new Date(start_time.getTime() + 2 * 60 * 60 * 1000);

    const { data, error } = await supabaseAdmin
      .from("events")
      .insert([
        {
          title,
          description,
          location,
          start_time,
          end_time,
          capacity: 100,
          is_published: true,
          created_by: userId
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);

  } catch (err) {
    console.error("Create event error:", err);
    res.status(500).json({ error: err.message });
  }
});


/* ================= REGISTRATIONS ================= */

app.post("/registrations", authenticate, async (req, res) => {
  try {
    const {
      event_id,
      firstName,
      lastName,
      email,
      phone,
      regNumber,
      attendees,
      requirements
    } = req.body;

    const userId = req.user.id;

    if (!event_id || !firstName || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    /* Duplicate check */
    const { data: existing } = await supabaseAdmin
      .from("registrations")
      .select("id")
      .eq("event_id", event_id)
      .eq("user_id", userId)
      .maybeSingle();

    if (existing) {
      return res.status(409).json({ error: "Already registered" });
    }

    const { error } = await supabaseAdmin
      .from("registrations")
      .insert([
        {
          event_id,
          user_id: userId,
          first_name: firstName,
          last_name: lastName || null,
          email,
          phone: phone || null,
          reg_number: regNumber || null,
          attendees: attendees ? Number(attendees) : 1,
          requirements: requirements || null
        }
      ]);

    if (error) throw error;

    res.status(201).json({ message: "Registration successful" });

  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ================= STUDENT DASHBOARD ================= */

app.get("/dashboard/student", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabaseAdmin
      .from("registrations")
      .select(`
        id,
        created_at,
        events (
          title,
          location,
          start_time
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data);

  } catch (err) {
    console.error("Student dashboard error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/dashboard/calendar", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (profileError) throw profileError;

    const role = profile?.role || "student";
    let events = [];

    if (role === "student") {
      const { data, error } = await supabaseAdmin
        .from("registrations")
        .select(`
          id,
          attendees,
          created_at,
          events (
            id,
            title,
            location,
            start_time,
            capacity,
            created_by
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      events = (data || [])
        .map((item) => {
          const event = item.events;
          if (!event) return null;

          return {
            id: event.id,
            title: event.title,
            location: event.location,
            start_time: event.start_time,
            capacity: event.capacity || 0,
            attendees: Number(item.attendees) || 1,
            source: "registration"
          };
        })
        .filter(Boolean);
    } else {
      let query = supabaseAdmin
        .from("events")
        .select("id, title, location, start_time, capacity, created_by")
        .order("start_time", { ascending: true });

      if (role !== "admin") {
        query = query.eq("created_by", userId);
      }

      const { data, error } = await query;
      if (error) throw error;

      const baseEvents = data || [];
      const eventIds = baseEvents.map((event) => event.id);
      let registrationTotals = {};

      if (eventIds.length > 0) {
        const { data: registrations, error: registrationsError } = await supabaseAdmin
          .from("registrations")
          .select("event_id, attendees")
          .in("event_id", eventIds);

        if (registrationsError) throw registrationsError;

        registrationTotals = (registrations || []).reduce((acc, registration) => {
          const count = Number(registration.attendees) || 1;
          acc[registration.event_id] = (acc[registration.event_id] || 0) + count;
          return acc;
        }, {});
      }

      events = baseEvents.map((event) => ({
        id: event.id,
        title: event.title,
        location: event.location,
        start_time: event.start_time,
        capacity: event.capacity || 0,
        attendees: registrationTotals[event.id] || 0,
        source: role === "admin" ? "overview" : "hosted"
      }));
    }

    res.json({
      role,
      events
    });
  } catch (err) {
    console.error("Calendar dashboard error:", err);
    res.status(500).json({ error: err.message });
  }
});



/* ================= AUTH ME ================= */

app.get("/auth/me", authenticate, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name, role")
      .eq("id", req.user.id)
      .single();

    if (error) throw error;

    res.json(data);

  } catch (err) {
    console.error("Auth/me error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ================= PROFILE SETTINGS ================= */

app.get("/profile", authenticate, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", req.user.id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error("Profile GET error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/profile", authenticate, async (req, res) => {
  try {
    const updates = req.body;

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .update(updates)
      .eq("id", req.user.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ message: "Profile updated successfully", data });
  } catch (err) {
    console.error("Profile PUT error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/dashboard/analytics", authenticate, async (_req, res) => {
  try {
    const { data: events, error: eventsError } = await supabaseAdmin
      .from("events")
      .select("id, title, capacity, is_published, start_time, location");

    if (eventsError) throw eventsError;

    const { data: registrations, error: registrationsError } = await supabaseAdmin
      .from("registrations")
      .select("id, event_id, user_id, attendees, created_at");

    if (registrationsError) throw registrationsError;

    const safeEvents = Array.isArray(events) ? events : [];
    const safeRegistrations = Array.isArray(registrations) ? registrations : [];

    const registrationCountByEvent = safeRegistrations.reduce((acc, registration) => {
      const attendeeCount = Number(registration.attendees) || 1;
      acc[registration.event_id] = (acc[registration.event_id] || 0) + attendeeCount;
      return acc;
    }, {});

    const totalEvents = safeEvents.length;
    const totalRegistrations = safeRegistrations.reduce(
      (sum, registration) => sum + (Number(registration.attendees) || 1),
      0
    );
    const activeStudents = new Set(
      safeRegistrations.map((registration) => registration.user_id).filter(Boolean)
    ).size;
    const publishedEvents = safeEvents.filter((event) => event.is_published).length;
    const totalCapacity = safeEvents.reduce(
      (sum, event) => sum + (Number(event.capacity) || 0),
      0
    );
    const avgAttendance = totalEvents
      ? Math.round(totalRegistrations / totalEvents)
      : 0;
    const fillRate = totalCapacity
      ? Math.round((totalRegistrations / totalCapacity) * 100)
      : 0;
    const publishRate = totalEvents
      ? Math.round((publishedEvents / totalEvents) * 100)
      : 0;

    const categoryTotals = safeEvents.reduce((acc, event) => {
      const bucket = getAnalyticsBucket(event);
      acc[bucket] = (acc[bucket] || 0) + 1;
      return acc;
    }, {});

    const palette = ["#9d6cff", "#449cff", "#42d7a8", "#ff924a", "#f35b82", "#f2b134"];
    const categories = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count], index) => ({
        name,
        count,
        percent: totalEvents ? Math.round((count / totalEvents) * 100) : 0,
        color: palette[index % palette.length]
      }));

    const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "long" });
    const monthlyMap = new Map();

    safeEvents.forEach((event) => {
      if (!event.start_time) return;
      const date = new Date(event.start_time);
      if (Number.isNaN(date.getTime())) return;

      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const existing = monthlyMap.get(key) || {
        key,
        month: monthFormatter.format(date),
        events: 0,
        registrations: 0
      };

      existing.events += 1;
      existing.registrations += registrationCountByEvent[event.id] || 0;
      monthlyMap.set(key, existing);
    });

    const monthly = Array.from(monthlyMap.values())
      .sort((a, b) => a.key.localeCompare(b.key))
      .slice(-6)
      .map(({ key, ...rest }, index) => ({
        ...rest,
        color: ["#faeefc", "#eaf5ff", "#edfaf4", "#fff1e8", "#eef2ff", "#fef3c7"][index % 6]
      }));

    res.json({
      summary: {
        total_events: totalEvents,
        avg_attendance: avgAttendance,
        active_students: activeStudents,
        fill_rate: fillRate,
        publish_rate: publishRate,
        total_registrations: totalRegistrations
      },
      categories,
      monthly
    });
  } catch (err) {
    console.error("Analytics dashboard error:", err);
    res.status(500).json({ error: err.message });
  }
});

function getAnalyticsBucket(event) {
  const title = String(event?.title || "").toLowerCase();
  const location = String(event?.location || "").toLowerCase();
  const haystack = `${title} ${location}`;

  if (haystack.includes("tech") || haystack.includes("hack") || haystack.includes("robot")) {
    return "Technical";
  }

  if (haystack.includes("music") || haystack.includes("dance") || haystack.includes("cultural")) {
    return "Cultural";
  }

  if (haystack.includes("sport") || haystack.includes("tournament") || haystack.includes("match")) {
    return "Sports";
  }

  if (haystack.includes("social") || haystack.includes("community") || haystack.includes("club")) {
    return "Community";
  }

  return event?.is_published ? "Published Events" : "Draft Events";
}
app.get("/dashboard/teacher", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get teacher events
    const { data: events, error: eventsError } = await supabaseAdmin
      .from("events")
      .select("*")
      .eq("created_by", userId);

    if (eventsError) throw eventsError;

    const eventIds = events.map(e => e.id);

    let registrations = [];
    if (eventIds.length > 0) {
      const { data, error } = await supabaseAdmin
        .from("registrations")
        .select("*")
        .in("event_id", eventIds);

      if (error) throw error;
      registrations = data;
    }

    res.json({
      kpis: {
        active_events: events.length,
        total_students: registrations.length,
        attendance_pct: events.length
          ? Math.round((registrations.length / (events.length * 100)) * 100)
          : 0,
        pending_approvals: 0
      },
      event_list: events.map(e => ({
        id: e.id,
        title: e.title,
        capacity: e.capacity || 0,
        booked: registrations.filter(r => r.event_id === e.id).length
      })),
      notifications: []
    });

  } catch (err) {
    console.error("Teacher dashboard error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ================= START SERVER ================= */

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
