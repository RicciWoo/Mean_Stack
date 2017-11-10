var User = require('mongoose').model('User'),
    passport = require('passport');

// returns a unified error message from a Mongoose error object
var getErrorMessage = function(err) {
  var message = '';

  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = 'Username already exists';
        break;
      default:
        message = 'Something went wrong';
    }
  } else {
    for (var errName in err.errors) {
      if (err.errors[errName].message)
        message = err.errors[errName].message;
    }
  }

  return message;
};

// to render sign-in page
exports.renderSignin = function(req, res, next) {
  if (!req.user) {
    res.render('signin', {
      title: 'Sign-in Form',
      // read message from flash
      message: req.flash('error') || req.flash('info')
    });
  } else {
    return res.redirect('/');
  }
};

// to render signup page
exports.renderSignup = function(req, res, next) {
  if (!req.user) {
    res.render('signup', {
      title: 'Sign-up Form',
      message: req.flash('error')  // read message from flash
    });
  } else {
    return res.redirect('/');
  }
};

// create a user, save it, call req.login() of Passport module
exports.signup = function(req, res, next) {
  if (!req.user) {
    var user = new User(req.body);
    var message = null;

    user.provider = 'local';

    user.save(function(err) {
      if (err) {
        var message = getErrorMessage(err);

        req.flash('error', message);  // write message to flash
        return res.redirect('/signup');
      }
      req.login(user, function(err) {
        if (err) return next(err);
        return res.redirect('/');
      });
    });
  } else {
    return res.redirect('/');
  }
};

// user logout() method provided by Passport module
exports.signout = function(req, res) {
  req.logout();
  res.redirect('/');
};

// Creating new users using save()
exports.create = function(req, res, next) {
  var user = new User(req.body);
  user.save(function(err) {
    if (err) {
      return next(err);  //passing the error to the next middleware
    } else {
      res.json(user);  //saves the user and outputs the user object
    }
  });
};

// Finding multiple user documents using find()
exports.list = function(req, res, next) {
  User.find({}, /*'username email',*/ function(err, users) {
    if (err) {
      return next(err);
    } else {
      res.json(users);
    }
  });
};

/*
// Advanced querying using find()
exports.list = function(req, res, next) {
  User.find({}, 'username email', {
    skip: 10,
    limit: 10
  }, function(err, users) {
    if (err) {
      return next(err);
    } else {
      res.json(users);
    }
  });
};
*/

// responding with a JSON representation of the req.user object
exports.read = function(req, res) {
  res.json(req.user);
};

// Reading a single user documeng using findOne()
exports.userByID = function(req, res, next, id) {
  User.findOne({
    _id: id
  }, function(err, user) {
    if (err) {
      return next(err);
    } else {
      req.user = user;
      next();
    }
  });
};

// Updating an existing user document
exports.update = function(req, res, next) {
  User.findByIdAndUpdate(req.user.id, req.body, function(err, user) {
    if (err) {
      return next(err);
    } else {
      res.json(user);
    }
  });
};

// Deleting an existing user document
exports.delete = function(req, res, next) {
  req.user.remove(function(err) {
    if (err) {
      return next(err);
    } else {
      res.json(req.user);
    }
  });
};
