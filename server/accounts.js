Accounts.onCreateUser(function(options, user) {
  // Create default trackertree
  var doc = {
    userId: user._id,
    json: defaultTrackerOntology
  };
  TrackerTrees.insert(doc, function(err){
    if (err){
      console.error(err);
    }
  });
  return user;
});
