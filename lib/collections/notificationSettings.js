NotificationSettings = new Mongo.Collection('notificationSettings');

NotificationSettings.allow({
  insert: function(userId, settings){
    return userId === settings.userId;
  },
  update: function(userId, settings){
    return userId === settings.userId;
  }
});