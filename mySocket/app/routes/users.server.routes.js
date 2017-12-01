var users = require('../../app/controllers/users.server.controller')
    passport = require('passport');

module.exports = function(app) {
  app.route('/signup')
     .get(users.renderSignup)
     .post(users.signup);

  app.route('/signin')
     .get(users.renderSignin)
     .post(passport.authenticate('local', {
       successRedirect: '/',
       failureRedirect: '/signin',
       failureFlash: true
     }));

  app.get('/signout', users.signout);

  app.route('/users')
    .post(users.create)  // Creating new users
    .get(users.list);  // Finding multiple user documents

  app.route('/users/:userId')
    .get(users.read)  // Reading a single user documeng
    .put(users.update)  // Updating an existing user document
    .delete(users.delete);  // Deleting an existing user document

  // app.param() mothod defines a middleware to be executed
  // before any other middleware that uses that parameter
  app.param('userId', users.userByID);
};
