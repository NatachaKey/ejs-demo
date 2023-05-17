const express = require("express");

const router = express.Router();
const {
  addTask,
  createTask,
  deleteTask,
  getTasks,
  updateTask,
  editTask,
} = require("../controllers/tasks");

router.route("/").post(createTask).get(getTasks);
router.route("/edit/:id").get(editTask);
router.route("/delete/:id").get(deleteTask);
router.route("/update/:id").post(updateTask);
router.route("/add").get(addTask);

module.exports = router;

// Important: HTML forms only support GET and POST operations
// We need to use Javascript/AJAX to send other types of operations.
// https://github.com/NatachaKey/06-jobs-api/blob/main/public/jobs.js#L368-L379 - example
//here since we're not running Javascript on the browser/frontend and are just rendering everything in the server, 
//we are sticking to just using the default behaviour of HTML forms, which means only GET and POST are available to us.