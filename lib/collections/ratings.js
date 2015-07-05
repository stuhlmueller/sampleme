Ratings = new Mongo.Collection('ratings');

Ratings.allow({
  remove: function(userId, rating){
    return userId === rating.userId;
  }
});
