NotificationSettings = new Meteor.Collection('notificationSettings');

// Ground.Collection(NotificationSettings);

NotificationSettings.allow({
  insert: function(userId, settings){
    return userId === settings.userId;
  },
  update: function(userId, settings){
    return userId === settings.userId;
  }
});
