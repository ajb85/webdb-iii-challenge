exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("students")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("students").insert([
        { name: "Jeff", cohort_id: 2 },
        { name: "Mike", cohort_id: 1 },
        { name: "Tom", cohort_id: 3 }
      ]);
    });
};
