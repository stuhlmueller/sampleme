Meteor.methods({
  'notify': function(title, message) {
    return App.notificationClient.sendNotification(this.userId, {
      title: title,
      message: message
    });
  },
  'insertRating': function(ratingAttributes){
    check(this.userId, String);
    var user = Meteor.user();
    var rating = _.extend(ratingAttributes, {
      userId: user._id,
      timestamp: new Date()
    });
    var ratingId = Ratings.insert(rating);
    return {
      _id: ratingId
    };
  }
});
