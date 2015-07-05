Events = new Mongo.Collection('events');

Events.allow({
  remove: function(userId, event){
    return userId === event.userId;
  }
});
