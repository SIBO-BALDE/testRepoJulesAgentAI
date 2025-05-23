// routes/noteRoutes.js
const express = require('express');
const { db } = require('../index'); // Adjust path if needed
const { protectRoute } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protectRoute);

// GET /api/notes - Get all notes for the authenticated user
router.get('/', (req, res, next) => {
  try {
    const userNotes = db.notes.filter(note => note.createdBy === req.user.userId);
    res.json(userNotes);
  } catch (error) {
    next(error);
  }
});

// POST /api/notes - Create a new note
router.post('/', (req, res, next) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required for a note.' });
    }
    const newNote = {
      id: `note-${Date.now().toString()}`,
      title,
      content,
      createdBy: req.user.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.notes.push(newNote);
    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
});

// GET /api/notes/:id - Get a single note by ID
router.get('/:id', (req, res, next) => {
  try {
    const note = db.notes.find(n => n.id === req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found.' });
    }
    if (note.createdBy !== req.user.userId) {
      // Optional: For strict ownership, uncomment the following line
      // return res.status(403).json({ message: 'Forbidden: You do not have access to this note.' });
      console.warn(`User ${req.user.userId} accessing note ${note.id} created by ${note.createdBy}`);
    }
    res.json(note);
  } catch (error) {
    next(error);
  }
});

// PUT /api/notes/:id - Update a note by ID
router.put('/:id', (req, res, next) => {
  try {
    const noteIndex = db.notes.findIndex(n => n.id === req.params.id);
    if (noteIndex === -1) {
      return res.status(404).json({ message: 'Note not found for update.' });
    }
    if (db.notes[noteIndex].createdBy !== req.user.userId) {
      // Optional: For strict ownership, uncomment the following line
      // return res.status(403).json({ message: 'Forbidden: You cannot update this note.' });
      console.warn(`User ${req.user.userId} attempting to update note ${db.notes[noteIndex].id} created by ${db.notes[noteIndex].createdBy}`);
    }

    const { title, content } = req.body;
    const updatedNote = { ...db.notes[noteIndex] };

    if (title) updatedNote.title = title;
    if (content) updatedNote.content = content;
    updatedNote.updatedAt = new Date().toISOString();

    db.notes[noteIndex] = updatedNote;
    res.json(updatedNote);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/notes/:id - Delete a note by ID
router.delete('/:id', (req, res, next) => {
  try {
    const noteIndex = db.notes.findIndex(n => n.id === req.params.id);
    if (noteIndex === -1) {
      return res.status(404).json({ message: 'Note not found for deletion.' });
    }
    if (db.notes[noteIndex].createdBy !== req.user.userId) {
      // Optional: For strict ownership, uncomment the following line
      // return res.status(403).json({ message: 'Forbidden: You cannot delete this note.' });
      console.warn(`User ${req.user.userId} attempting to delete note ${db.notes[noteIndex].id} created by ${db.notes[noteIndex].createdBy}`);
    }

    db.notes.splice(noteIndex, 1);
    res.status(200).json({ message: 'Note deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
