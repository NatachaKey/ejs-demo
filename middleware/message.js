const setMessage = (req, res, next) => {
    if (req.session.pendingMessage) {
      res.locals.message = req.session.pendingMessage;
    } else {
      res.locals.message = "";
    }
    req.session.pendingMessage = "";
    next();
  };
  
  module.exports = setMessage;

  //This is to provide a means of giving the user a message about the results of CRUD operations.
//    We use middleware to make sure the message is shown exactly once.
//     The value of the message is retrieved from the session. 
  //each separate user accessing the application has a separate session.
//   The message has to be available after a redirect, which means that the browser sends 
//   another request before the message is displayed, and the message can’t be kept in plain memory,
//    otherwise one user might get a message intended for another. The value of the message is set
//     into res.locals.message so that it is available via the variable “message” 
//   in each of the .ejs files — there is no need to pass the message variable on the render call.

//question- just to make sure: line 7- does this line mean that by default the value of req.session.pendingMessange is equal to an empty string?

