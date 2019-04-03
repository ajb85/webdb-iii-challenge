const express = require("express");
const helmet = require("helmet");
const cohortRoutes = require("./cohorts/routes.js");
const studentRoutes = require("./students/routes.js");

const server = express();

server.use(express.json());
server.use(helmet());

server.get("/", (req, res) => {
  res.status(200).send("OK");
});

server.use("/api/cohorts", cohortRoutes);
server.use("/api/students", studentRoutes);

module.exports = server;
