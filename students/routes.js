const routes = require("express").Router();
const knex = require("knex");

const knexConfig = {
  client: "sqlite3",
  useNullAsDefault: true,
  connection: {
    filename: "./data/lambda.sqlite3"
  }
};
const db = knex(knexConfig);

routes.get("/", async (req, res) => {
  try {
    const students = await db
      .select("s.name", "c.name as cohort", "s.id")
      .from("students as s")
      .join("cohorts as c", { "c.id": "s.cohort_id" });
    res.status(200).json(students);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error retrieving students" });
  }
});

routes.post("/", async (req, res) => {
  const nameCheck =
    req.body.hasOwnProperty("name") && req.body.name.toString().length > 0;
  const cohortCheck =
    req.body.hasOwnProperty("cohort_id") &&
    req.body.cohort_id.toString().length > 0;
  if (nameCheck && cohortCheck) {
    try {
      const id = await db.insert(req.body).into("students");
      res.status(201).json({ id: id[0] });
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ message: "There was an error adding that to the databaes." });
    }
  } else {
    status(400).json({
      message: "Please include a name and cohort_id with the entry"
    });
  }
});

routes.get("/:id", async (req, res) => {
  try {
    const student = await db
      .select("s.name", "c.name as cohort", "s.id")
      .from("students as s")
      .join("cohorts as c", { "c.id": "s.cohort_id" })
      .where({ "s.id": req.params.id })

      .first();

    student
      ? res.status(200).json(student)
      : res.status(404).json({ message: "No student with that ID" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "There was an error retriving that ID" });
  }
});

routes.delete("/:id", async (req, res) => {
  try {
    const count = await db("students")
      .where({ id: req.params.id })
      .del();
    count
      ? res.status(204).end()
      : res.status(404).json({ message: "No student with that ID" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "There was an error deleting that ID" });
  }
});

routes.put("/:id", async (req, res) => {
  try {
    const nameCheck =
      req.body.hasOwnProperty("name") && req.body.name.toString().length > 0;
    const cohortCheck =
      req.body.hasOwnProperty("cohort_id") &&
      req.body.cohort_id.toString().length > 0;
    if (nameCheck && cohortCheck) {
      const count = await db("students")
        .where({ id: req.params.id })
        .update(req.body);
      count
        ? res.status(200).end()
        : res.status(404).json({ message: "No student with that ID" });
    } else {
      res
        .status(400)
        .json({ message: "I need a name included with the put request." });
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "There was an error updating that student" });
  }
});

module.exports = routes;
