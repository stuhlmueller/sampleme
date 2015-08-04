subscribed = false;

Tracker.autorun(function(){
  if (Meteor.user() && !subscribed){
    Meteor.subscribe('events');
    Meteor.subscribe('notificationSettings');
    Meteor.subscribe('trackertrees');
    subscribed = true;
  }
});
