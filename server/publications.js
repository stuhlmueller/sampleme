Meteor.publish('events', function(){
  return Events.find({userId: this.userId});
});

Meteor.publish('notificationSettings', function(){
  return NotificationSettings.find({userId: this.userId});
});

Meteor.publish('trackertrees', function(){
  return TrackerTrees.find({userId: this.userId});
});
