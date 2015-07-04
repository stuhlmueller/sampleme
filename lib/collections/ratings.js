Ratings = new Mongo.Collection('ratings');

Ratings.allow({
  remove: function(userId, rating){
    return userId === rating.userId;
  }
});

NotificationSettings = new Mongo.Collection('notificationSettings');

NotificationSettings.allow({
  insert: function(userId, settings){
    return userId === settings.userId;
  },
  update: function(userId, settings){
    return userId === settings.userId;
  }
})
