subscribed = false;

Tracker.autorun(function(){
  if (Meteor.user() && !subscribed){
    Meteor.subscribe('events');
    Meteor.subscribe('notificationSettings');
    Meteor.subscribe('trackertrees');
    // if(TrackerTrees.ready())
    // {
      // if(!Ground.lookup('trackertrees')) {
      //   console.log("grounding")
      //   Ground.Collection(TrackerTrees);
      // }
    // }
    subscribed = true;
  }
});
