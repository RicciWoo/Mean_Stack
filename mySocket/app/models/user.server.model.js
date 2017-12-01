var mongoose = require('mongoose'),
    crypto = require('crypto'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    //index: true,  // lots of queries on email, creating secondary index
    match: [
      /.+\@.+\..+/,  // match validator for strings, validators the field
      "Please fill a valid e-mail address"
    ]
  },
  username: {
    type: String,
    unique: true,  // validates uniqueness of a field across a collection
    //required: true,  // validates field existence
    required: 'Username is required',
    trim: true  // trim modifier to remove whitespaces
  },
  password: {
    type: String,
    // Custom validators, array of a validation function and an error message
    validate: [
      function(password) {
        return password && password.length >= 6;
      }, 'Password should be longer'
    ]
  },
  salt: {  // use to hash your passport
    type: String
  },
  provider: {  // strategy used to register the user
    type: String,
    required: 'Provider is required'
  },
  providerId: String,  // user identifier for authentication Strategy
  providerData: {},  // to store user object retrieved from OAuth providers
  // save the time the user document was initially created
  created: {
    type: Date,
    default: Date.now
  }
  /*
  role: {
    type: String,
    // enum validator for strings, defines a set of strings for the field
    enum: ['Admin', 'Owner', 'User']
  },
  */
  /*
  website: {
    type: String,
    /// custom modifier that validates the existence of 'http://'
    //// or 'https://' prefixes and adds them when necessary
    //set: function(url) {
    //  if (!url) {
    //    return url;
    //  } else {
    //    if (url.indexOf('http://') !== 0 && url.indexOf('https://') !==0) {
    //      url = 'http://' + url;
    //    }
    //    return url;
    //  }
    //}
    // getter modifier that changes already existing user documents
    // by modifying their website field at query time instead of
    // going over your MongoDB collection and updating each document
    get: function(url) {
      if (!url) {
        return url;
      } else {
        if (url.indexOf('http://') !== 0 && url.indexOf('https"//') !== 0) {
          url = 'http://' + url;
        }
        return url;
      }
    }
  }
  */
});

/*
// to include getters when converting MongoDB document to a JSON
// and allow using res.json() to include getter's behavior
UserSchema.set('toJSON', {getters: true});
*/

// Adding virtual attributes
UserSchema.virtual('fullName').get(function() {  // getter method
  return this.firstName + ' ' + this.lastName;
}).set(function(fullName) {                      // setters
  var splitName = fullName.split(' ');
  this.firstName = splitName[0] || '';
  this.lastName = splitName[1] || '';
});

/*
// Model static methods give you the liberty to perform model-level
// operations, such as adding extra find methods.
UserSchema.static.findOneByUsername = function (username, callback) {
  this.findOne({username: new RegExp(username, 'i')}, callback);
};
// the way to call it
//User.findOneByUsername('username', function(err, user) {
//  ...
//});
*/

/*
// Defining custom instance methods
UserSchema.methods.authenticate = function(password) {
  return this.password === password;
};
// the way to call it
//user.authenticate('password');
*/

/*
// Using Mongoose pre middleware
UserSchema.pre('save', function(next) {
  if (...) {
    next()
  } else {
    next(new Error('An Error Occured!'));
  }
});

// Using Mongoose post middleware
UserSchema.post('save', function(next) {
  if(this.isNew) {
    console.log('A new user was created.');
  } else {
    console.log('A user updated is details.');
  }
});
*/

// to handle hashing of your user's passwords
UserSchema.pre('save', function(next) {
  if (this.password) {
    this.salt = new
      Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
    this.password = this.hashPassword(this.password);
  }

  next();
});

UserSchema.methods.hashPassword = function(password) {
  return crypto.pbkdf2Sync(password, this.salt, 10000,
    64).toString('base64');
};

UserSchema.methods.authenticate = function(password) {
  return this.password === this.hashPassword(password);
};

UserSchema.static.findUniqueUsername = function(username, suffix,
  callback) {
  var _this = this;
  var possibleUsername = username + (suffix || '');

  _this.findOne({
    username: possibleUsername
  }, function(err, user) {
    if (!err) {
      if (!user) {
        callback(possibleUsername);
      } else {
        return _this.findUniqueUsername(username, (suffix || 0) +
          1, callback);
      }
    } else {
      callback(null);
    }
  });
};

// configured your schema to include virtual attributes
UserSchema.set('toJSON', {
  getters: true,
  virtuals: true
});

mongoose.model('User', UserSchema);
