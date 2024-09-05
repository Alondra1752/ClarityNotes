const express = require("express");
const path = require("path");

const api = require("./routes/apiRoutes");
const PORT = 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", api);

app.use(express.static("public"));

// the main route
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/develop/public/index.html"))
);

// route for the notes
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/develop/public/notes.html"))
);

app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/develop/public/index.html"))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);

