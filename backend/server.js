import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { createClient } from "@supabase/supabase-js";

import { supabaseAdmin } from "./supabase.js";
import { authenticate } from "./authMiddleware.js";

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
          reg_number: regNumber|| null,
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

app.get("/dashboard/teacher", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    /* Get events created by teacher */
    const { data: events, error: eventsError } = await supabaseAdmin
      .from("events")
      .select("*")
      .eq("created_by", userId);

    if (eventsError) throw eventsError;

    /* Get registrations count */
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
      active_events: events.length,
      total_registrations: registrations.length,
      events
    });

  } catch (err) {
    console.error("Teacher dashboard error:", err);
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
