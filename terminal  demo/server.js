const express = require("express");
const bodyParser = require("body-parser");
const { spawn } = require("child_process");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Start persistent bash shell
let shell = spawn("bash", [], { stdio: ["pipe", "pipe", "pipe"] });

app.post("/run", (req, res) => {
  const command = req.body.command;

  let output = "";

  const handleStdout = (data) => {
    output += data.toString();
  };

  const handleStderr = (data) => {
    output += data.toString();
  };

  shell.stdout.on("data", handleStdout);
  shell.stderr.on("data", handleStderr);

  // Write the command to bash
  shell.stdin.write(command + "\n");

  // Wait a bit for command to finish, then send response
  setTimeout(() => {
    // Clean up listeners so they don't pile up
    shell.stdout.off("data", handleStdout);
    shell.stderr.off("data", handleStderr);

    res.json({ output: output || "(no output)" });
  }, 300);
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
