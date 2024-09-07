const express = require('express');
const fs = require('fs');
const path = require('path');
const { readFromFile, writeToFile, readAndAppend } = require('./utilities/fs.js'); // Adjust path as necessary

const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies

// HTML Routes
const noteRoute = require('./htmlRoutes');
app.use('/notes', noteRoute);

// API Routes

// GET /api/notes - Fetch all notes
app.get('/api/notes', (req, res) => {
  readFromFile(path.join(__dirname, './db/db.json'))
    .then((data) => res.json(JSON.parse(data)))
    .catch((err) => {
      console.error('Error reading file', err);
      res.status(500).json({ error: 'Failed to read notes' });
    });
});

// POST /api/notes - Create a new note
app.post('/api/notes', (req, res) => {
  const { title, text } = req.body;

  if (title && text) {
    const id = Date.now();
    const newNote = { title, text, id };

    readAndAppend(newNote, path.join(__dirname, './db/db.json'))
      .then(() => res.status(201).json({ message: 'Note added successfully', note: newNote }))
      .catch((err) => {
        console.error('Error adding note', err);
        res.status(500).json({ error: 'Failed to add note' });
      });
  } else {
    res.status(400).json({ error: 'Title and text are required' });
  }
});

// PUT /api/notes/:id - Update a note by ID
app.put('/api/notes/:id', (req, res) => {
  const noteId = parseInt(req.params.id, 10);
  const { title, text } = req.body;

  if (title && text) {
    readFromFile(path.join(__dirname, './db/db.json'))
      .then((data) => {
        const notes = JSON.parse(data);
        const noteIndex = notes.findIndex((note) => note.id === noteId);

        if (noteIndex !== -1) {
          notes[noteIndex] = { ...notes[noteIndex], title, text };
          return writeToFile(path.join(__dirname, './db/db.json'), notes);
        } else {
          res.status(404).json({ error: 'Note not found' });
        }
      })
      .then(() => res.json({ message: 'Note updated successfully' }))
      .catch((err) => {
        console.error('Error updating note', err);
        res.status(500).json({ error: 'Failed to update note' });
      });
  } else {
    res.status(400).json({ error: 'Title and text are required' });
  }
});

// DELETE /api/notes/:id - Delete a note by ID
app.delete('/api/notes/:id', (req, res) => {
  const noteId = parseInt(req.params.id, 10);

  readFromFile(path.join(__dirname, './db/db.json'))
    .then((data) => {
      const notes = JSON.parse(data);
      const updatedNotes = notes.filter((note) => note.id !== noteId);

      if (updatedNotes.length !== notes.length) {
        return writeToFile(path.join(__dirname, './db/db.json'), updatedNotes);
      } else {
        res.status(404).json({ error: 'Note not found' });
      }
    })
    .then(() => res.json({ message: 'Note deleted successfully' }))
    .catch((err) => {
      console.error('Error deleting note', err);
      res.status(500).json({ error: 'Failed to delete note' });
    });
});

// Export the app module
module.exports = app;

