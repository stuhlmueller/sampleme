notificationsEnabled = function(userId){
  if (!userId){
    if (!Meteor.user()){
      return false;
    } else {
      userId = Meteor.user()._id;
    }
  }
  var settings = NotificationSettings.findOne({userId: userId});
  if (settings === undefined){
    NotificationSettings.insert({
      userId: userId,
      notificationsEnabled: false
    });
    return false;
  } else {
    return settings.notificationsEnabled;
  }
};
