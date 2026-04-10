require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 5000;

// ==========================================
// 1. SETUP SUPABASE CLIENT
// ==========================================
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("ERROR: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ==========================================
// 2. MIDDLEWARE
// ==========================================
app.use(cors()); // Enables CORS for frontend
app.use(express.json()); // Parses JSON bodies

// Health check
app.get('/health', (req, res) => res.json({ success: true, message: 'Clubs module API is running smoothly.' }));

// ==========================================
// 3. AUTH MIDDLEWARE
// ==========================================
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    }

    req.user = user; // Attach user object to request
    next();
  } catch (err) {
    console.error('Auth Error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error in auth middleware' });
  }
};

// ==========================================
// 4. API ENDPOINTS - PUBLIC
// ==========================================

// GET /events -> Fetch all Jaipur events from database
app.get('/events', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('city_events')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, message: 'Events fetched successfully', data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, data: null });
  }
});

// GET /clubs -> Fetch all clubs
app.get('/clubs', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('clubs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, message: 'Clubs fetched successfully', data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, data: null });
  }
});

// GET /clubs/:id -> Fetch single club
app.get('/clubs/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('clubs')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
         return res.status(404).json({ success: false, message: 'Club not found', data: null });
      }
      throw error;
    }

    res.json({ success: true, message: 'Club fetched successfully', data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, data: null });
  }
});

// GET /clubs/category/:category -> Filter clubs by category
app.get('/clubs/category/:category', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('clubs')
      .select('*')
      .eq('category', req.params.category)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, message: `Clubs filtered by category: ${req.params.category}`, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, data: null });
  }
});

// ==========================================
// 5. API ENDPOINTS - PROTECTED (CLUBS)
// ==========================================

// POST /clubs -> Create club (logged-in users only)
app.post('/clubs', authenticate, async (req, res) => {
  try {
    const { name, description, category, image_url, contact_email } = req.body;
    
    // Simple validation
    if (!name) return res.status(400).json({ success: false, message: 'Club name is required', data: null });

    const newClub = {
      name,
      description,
      category,
      image_url,
      contact_email,
      created_by: req.user.id
    };

    // Insert the new club
    const { data: clubData, error: clubError } = await supabase
      .from('clubs')
      .insert([newClub])
      .select()
      .single();

    if (clubError) throw clubError;

    // Automatically add the creator as an approved admin in club_members
    await supabase.from('club_members').insert([{
      club_id: clubData.id,
      user_id: req.user.id,
      role: 'admin',
      status: 'approved'
    }]);

    res.status(201).json({ success: true, message: 'Club created successfully', data: clubData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, data: null });
  }
});

// PUT /clubs/:id -> Update club (only creator or admin)
app.put('/clubs/:id', authenticate, async (req, res) => {
  try {
    const clubId = req.params.id;
    const userId = req.user.id;

    // Fetch club to check authorization
    const { data: club, error: fetchError } = await supabase.from('clubs').select('*').eq('id', clubId).single();
    if (fetchError || !club) return res.status(404).json({ success: false, message: 'Club not found' });

    // Ensure user is creator
    let isAuthorized = club.created_by === userId;

    // If not creator, check if user is an approved admin in the club
    if (!isAuthorized) {
      const { data: adminCheck } = await supabase.from('club_members')
        .select('*')
        .eq('club_id', clubId)
        .eq('user_id', userId)
        .eq('role', 'admin')
        .eq('status', 'approved')
        .single();
      if (adminCheck) isAuthorized = true;
    }

    if (!isAuthorized) {
      return res.status(403).json({ success: false, message: 'Forbidden: Only creator or admin can update the club' });
    }

    // Perform the update
    const { data: updatedClub, error: updateError } = await supabase
      .from('clubs')
      .update(req.body)
      .eq('id', clubId)
      .select()
      .single();

    if (updateError) throw updateError;
    res.json({ success: true, message: 'Club updated successfully', data: updatedClub });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, data: null });
  }
});

// DELETE /clubs/:id -> Delete club (only creator)
app.delete('/clubs/:id', authenticate, async (req, res) => {
  try {
    const clubId = req.params.id;
    const userId = req.user.id;

    // Verify creator status
    const { data: club, error: fetchError } = await supabase.from('clubs').select('created_by').eq('id', clubId).single();
    if (fetchError || !club) return res.status(404).json({ success: false, message: 'Club not found' });

    if (club.created_by !== userId) {
      return res.status(403).json({ success: false, message: 'Forbidden: Only creator can delete the club' });
    }

    // Delete club (club_members are handles by ON DELETE CASCADE in the DB schema)
    const { error: deleteError } = await supabase.from('clubs').delete().eq('id', clubId);
    if (deleteError) throw deleteError;

    res.json({ success: true, message: 'Club deleted successfully', data: null });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, data: null });
  }
});

// ==========================================
// 6. API ENDPOINTS - MEMBERSHIP
// ==========================================

// POST /clubs/:id/join -> Create join request (status = pending)
app.post('/clubs/:id/join', authenticate, async (req, res) => {
  try {
    const clubId = req.params.id;
    const userId = req.user.id;

    // Prevent duplicate join requests based on club_id and user_id
    const { data: existingMember } = await supabase.from('club_members')
      .select('*')
      .eq('club_id', clubId)
      .eq('user_id', userId)
      .single();

    if (existingMember) {
      return res.status(400).json({ 
        success: false, 
        message: existingMember.status === 'pending' 
          ? 'Join request is already pending' 
          : 'User is already a member' 
      });
    }

    const { data: joinReq, error } = await supabase.from('club_members').insert([{
      club_id: clubId,
      user_id: userId,
      role: 'member',
      status: 'pending',
      application_data: req.body // Store the entire frontend form cleanly
    }]).select().single();

    if (error) throw error;
    res.status(201).json({ success: true, message: 'Join request submitted. Pending approval from club admin.', data: joinReq });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, data: null });
  }
});

// GET /clubs/:id/members -> List members (only admin/creator)
app.get('/clubs/:id/members', authenticate, async (req, res) => {
  try {
    const clubId = req.params.id;
    const userId = req.user.id;

    // Authorization check
    const { data: club } = await supabase.from('clubs').select('created_by').eq('id', clubId).single();
    if (!club) return res.status(404).json({ success: false, message: 'Club not found' });

    let isAuthorized = club.created_by === userId;
    if (!isAuthorized) {
      const { data: adminCheck } = await supabase.from('club_members')
        .select('*')
        .eq('club_id', clubId)
        .eq('user_id', userId)
        .eq('role', 'admin')
        .eq('status', 'approved')
        .single();
      if (adminCheck) isAuthorized = true;
    }

    if (!isAuthorized) {
      return res.status(403).json({ success: false, message: 'Forbidden: Only admin or creator can view members' });
    }

    // Fetch members natively
    const { data, error } = await supabase.from('club_members').select('*').eq('club_id', clubId);
    if (error) throw error;

    res.json({ success: true, message: 'Members fetched successfully', data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, data: null });
  }
});

// PUT /clubs/:id/members/:memberId -> Approve/reject/promote member
app.put('/clubs/:id/members/:memberId', authenticate, async (req, res) => {
  try {
    const clubId = req.params.id;
    const memberId = req.params.memberId; // Assuming this is the primary key (id) of the club_members table
    const userId = req.user.id;
    const { role, status } = req.body;

    // Authorization check
    const { data: club } = await supabase.from('clubs').select('created_by').eq('id', clubId).single();
    if (!club) return res.status(404).json({ success: false, message: 'Club not found' });

    let isAuthorized = club.created_by === userId;
    if (!isAuthorized) {
      const { data: adminCheck } = await supabase.from('club_members')
        .select('*')
        .eq('club_id', clubId)
        .eq('user_id', userId)
        .eq('role', 'admin')
        .eq('status', 'approved')
        .single();
      if (adminCheck) isAuthorized = true;
    }

    if (!isAuthorized) {
      return res.status(403).json({ success: false, message: 'Forbidden: Only admin or creator can manage members status/roles' });
    }

    // Perform Update
    const updateData = {};
    if (role) updateData.role = role;
    if (status) updateData.status = status;

    const { data: updatedMember, error } = await supabase
      .from('club_members')
      .update(updateData)
      .eq('id', memberId)
      .eq('club_id', clubId) // double safety check
      .select()
      .single();

    if (error) throw error;
    if (!updatedMember) return res.status(404).json({ success: false, message: 'Membership record not found' });

    res.json({ success: true, message: 'Member updated successfully', data: updatedMember });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, data: null });
  }
});

app.listen(port, () => {
  console.log(`🚀 Clubs Backend Server is running on port ${port}...`);
});
