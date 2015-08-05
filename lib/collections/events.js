Events = new Meteor.Collection('events');

// Ground.Collection(Events);

Events.allow({
  remove: function(userId, event){
    return userId === event.userId;
  }
});
