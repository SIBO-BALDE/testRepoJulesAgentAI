// routes/leadRoutes.js
const express = require('express');
const { db } = require('../index'); // Adjust path if needed
const { protectRoute } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protectRoute);

// GET /api/leads - Get all leads for the authenticated user
router.get('/', (req, res, next) => {
  try {
    const userLeads = db.leads.filter(lead => lead.createdBy === req.user.userId);
    res.json(userLeads);
  } catch (error) {
    next(error);
  }
});

// POST /api/leads - Create a new lead
router.post('/', (req, res, next) => {
  try {
    const { contactName, companyName, email, phone, status } = req.body;
    if (!contactName || !email) {
      return res.status(400).json({ message: 'Contact name and email are required for a lead.' });
    }
    const newLead = {
      id: `lead-${Date.now().toString()}`,
      contactName,
      companyName: companyName || '',
      email,
      phone: phone || '',
      status: status || 'New', // Default status
      createdBy: req.user.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.leads.push(newLead);
    res.status(201).json(newLead);
  } catch (error) {
    next(error);
  }
});

// GET /api/leads/:id - Get a single lead by ID
router.get('/:id', (req, res, next) => {
  try {
    const lead = db.leads.find(l => l.id === req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found.' });
    }
    if (lead.createdBy !== req.user.userId) {
      // Optional: For strict ownership, uncomment the following line
      // return res.status(403).json({ message: 'Forbidden: You do not have access to this lead.' });
      // For now, allowing access for testing purposes as per customerRoutes example.
      console.warn(`User ${req.user.userId} accessing lead ${lead.id} created by ${lead.createdBy}`);
    }
    res.json(lead);
  } catch (error) {
    next(error);
  }
});

// PUT /api/leads/:id - Update a lead by ID
router.put('/:id', (req, res, next) => {
  try {
    const leadIndex = db.leads.findIndex(l => l.id === req.params.id);
    if (leadIndex === -1) {
      return res.status(404).json({ message: 'Lead not found for update.' });
    }
    if (db.leads[leadIndex].createdBy !== req.user.userId) {
      // Optional: For strict ownership, uncomment the following line
      // return res.status(403).json({ message: 'Forbidden: You cannot update this lead.' });
      console.warn(`User ${req.user.userId} attempting to update lead ${db.leads[leadIndex].id} created by ${db.leads[leadIndex].createdBy}`);
    }

    const { contactName, companyName, email, phone, status } = req.body;
    const updatedLead = { ...db.leads[leadIndex] };

    if (contactName) updatedLead.contactName = contactName;
    if (companyName !== undefined) updatedLead.companyName = companyName;
    if (email) updatedLead.email = email;
    if (phone !== undefined) updatedLead.phone = phone;
    if (status) updatedLead.status = status;
    updatedLead.updatedAt = new Date().toISOString();

    db.leads[leadIndex] = updatedLead;
    res.json(updatedLead);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/leads/:id - Delete a lead by ID
router.delete('/:id', (req, res, next) => {
  try {
    const leadIndex = db.leads.findIndex(l => l.id === req.params.id);
    if (leadIndex === -1) {
      return res.status(404).json({ message: 'Lead not found for deletion.' });
    }
    if (db.leads[leadIndex].createdBy !== req.user.userId) {
      // Optional: For strict ownership, uncomment the following line
      // return res.status(403).json({ message: 'Forbidden: You cannot delete this lead.' });
      console.warn(`User ${req.user.userId} attempting to delete lead ${db.leads[leadIndex].id} created by ${db.leads[leadIndex].createdBy}`);
    }

    db.leads.splice(leadIndex, 1);
    res.status(200).json({ message: 'Lead deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
