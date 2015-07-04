Meteor.publish('ratings', function(){
  return Ratings.find({userId: this.userId});
});

Meteor.publish('notificationSettings', function(){
  return NotificationSettings.find({userId: this.userId});
});
