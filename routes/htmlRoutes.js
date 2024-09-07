const note = require("express").Router();
const { readFromFile, writeToFile, readAndAppend } = require("../utilities/fs");

// get note
note.get("/", (req, res) => {
  // parses JSON data response
  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)))
  .catch((err) => {
    console.error("Error reading file", err);
    res.status(500).json({error: "Failed to read notes"});
  });
});

// creates a new note
note.post("/", (req, res) => {
  // gets title and text from request body
  const { title, text } = req.body;

  // check if title and text exist
  if (title && text) {
    // this grabs the current date
    const id = Date.now();
    //  new note object with the title and text 
    const addNote = {
      title,
      text,
      id,
    };
   
    readAndAppend(addNote, path.join(_dirname, '../db/db.json'))
    .then(() => {
        console.log('Note added successfully');
        res.status(201).json({ message: 'Note added successfully', note: addNote});
    })
    .catch((err) => {
        console.error('Error adding note', err);
        res.status(500).json({error: 'Failed to add note'});
    });
} else {
    console.error('Note not added. Missing title or text.');
    res.status(400).json({error: 'Note not added. Titile and text are required.'});
}

});

// deletes note

note.delete("/:id", (req, res) => {
  // gets id from request
  const id = Number(req.params.id);

  // gets the notes from db.json folder
  readFromFile("./db/db.json")
    .then((data) => JSON.parse(data))
    .then((json) => {
      // filters out the note to the matching id
      const result = json.filter((note) => note.id !== id);
      if (result.length === json.length) {
        return res.status(404).json({ error: "Note not found"});
      }
      return writeToFile("./db/db.json", result);
    })
    .then(() => {
        console.log("Note has been deleted");
        res.json({ message: "Note has been deleted"});
    })
    .catch((err) => {
        console.error("Error deleting note", err);
        res.status(500).json({error: "Failed to delete note"});
    });
});

module.exports = note;