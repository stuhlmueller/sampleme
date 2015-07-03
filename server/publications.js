Meteor.publish('ratings', function(){
  return Ratings.find({userId: this.userId});
});
