const note = require("express").Router();
const { readFromFile, writeToFile, readAndAppend } = require("../utilities/fs");

// get note
note.get("/", (req, res) => {
  // parses JSON data response
  readFromFile("./develop/db/db.json").then((data) => res.json(JSON.parse(data)));
});

// creates a new note
note.post("/", (req, res) => {
  // gets title and text from request body
  const { title, text } = req.body;

  // check if title and text exist
  if (title && text) {
    // this grabs the current date
    var id = Date.now();
    // construct a new note object with the title and text 
    const addNote = {
      title,
      text,
      id,
    };
    // write note information to db.json
    console.log(addNote);

    readAndAppend(addNote, "./develop/db/db.json");

   
    // sends a response to the user
    console.log("Note added successfully");
    res.json("Note added successfully");
  } else {
    console.error("Note not added");
    res.error("Note not added");
  }
});

// deletes note

note.delete("/:id", (req, res) => {
  // gets id from request
  const id = Number(req.params.id);

  // gets the notes from db.json folder
  readFromFile("./develop/db/db.json")
    .then((data) => JSON.parse(data))
    .then((json) => {
      // filters out the note to the matching id
      const result = json.filter((note) => note.id !== id);
      
      writeToFile("./develop/db/db.json", result);
      res.json("Note has been deleted");
      console.log("Note has been deleted");
    });
});

module.exports = note;