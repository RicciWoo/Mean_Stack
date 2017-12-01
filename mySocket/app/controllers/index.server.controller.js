exports.render = function(req, res) {
  res.render('index', {
    title: 'Hello World',
    user: JSON.stringify(req.user)
    //userFullName: req.user ? req.user.fullName : ''
  });
};

/*
exports.render = function(req, res) {
  if (req.session.lastVisit) {
    console.log(req.session.lastVist);
  }

  req.session.lastVist = new Date();

  res.render('index11', {
    title: 'Hello World'
  });
};
*/
