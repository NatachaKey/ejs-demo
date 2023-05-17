const Task = require('../models/Task');

const addTask = (req, res) => {
  res.render('pages/addTask');
};

// Here we are using the values posted in req.body to create a task. That may succeed or fail,
//  depending on the validation of values. req.body.complete may have the string value “true” for complete,
//   which must be changed to the boolean value of true for completed. If the create is successful, a pending message
//    (which is displayed after a redirect operation) gives the user feedback, and a redirect is sent back to display
//    the tasks page again. If the create fails, the user is given a message, which might be a schema validation error,
//     and the add page is rendered again.
//  Note: the method must be async so that we can await the result of the create operation.

const createTask = async (req, res) => {
  try {
    if (req.body.complete) {
      req.body.completed = true;
    }
    await Task.create(req.body);
    req.session.pendingMessage = 'The task was created.';
    res.redirect('/tasks');
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.locals.message = Object.values(err.errors)
        .map((item) => item.message)
        .join(', ');
    } else {
      res.locals.message = 'Something went wrong.';
    }
    res.render('pages/addTask');
  }
};

// To edit a task, you have to load it first, hence the findById call. That may fail in which case the error
// is reported to the user.
// If it succeeds, the task variable is passed to the editTask.ejs on the render.

const editTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    res.render('pages/editTask', { task });
  } catch (err) {
    req.session.pendingMessage = 'Something went wrong.';
    res.redirect('/tasks');
  }
};

// FIrst, we find the task being updated. Then we attempt to update it with the values from the body of the post request.
//  Then, if that fails, we render the page again, passing the message and the task on the render call.
//  If it succeeds, we give the user the success message and redirect to the tasks page.

//here in the given code we couldn´t edit correctly the checkbox - if once it is/was set to true/completed, the user wouldn´t be able to set it back to false if he wants
// so I added lines 62-64 to fix it, is it a correct solution?


const updateTask = async (req, res) => {
  let task = false;
  try {
    if (req.body.complete) {
      req.body.completed = true;
    } else {
      req.body.completed = false;
    }
    task = await Task.findById(req.params.id);
    await Task.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
    });
    req.session.pendingMessage = 'The task was updated.';
    console.dir(req.body)
    res.redirect('/tasks');
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.locals.message = Object.values(err.errors)
        .map((item) => item.message)
        .join(', ');
    } else {
      res.locals.message = 'Something went wrong.';
    }
    if (task) {
      res.render('pages/editTask', { task });
    } else {
      req.session.pendingMessage = 'Something went wrong.';
      res.redirect('/tasks');
    }
  }
};
//what do runValidators do on line 67?
//That tells mongoose to check if the fields that were passed in (the second argument to findByIdAndUpdate, 
  //which is req.body) pass all the validation in models/Task.js. If there's anything that.
// doesn't pass, it will raise an error with the name ValidationError, which we're catching in line 72-76.
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) { 
      req.session.pendingMessage = "The task you are trying to delete does not exist.";
  } else {
      req.session.pendingMessage = "The task was deleted successfully.";
  }
    res.redirect('/tasks');
  } catch (err) {
    req.session.pendingMessage = 'Something went wrong.';
    res.redirect('/tasks');
  }
};

//   This method retrieves the list of tasks. It may be an empty array, or a list of tasks,
//   which is passed on the render call to the tasks.ejs template on the render call.
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.render('pages/tasks', { tasks });
  } catch (err) {
    res.locals.message = 'Something went wrong.';
    res.render('pages/tasks', { tasks: [] });
  }
};

module.exports = {
  addTask,
  createTask,
  deleteTask,
  updateTask,
  editTask,
  getTasks,
};
