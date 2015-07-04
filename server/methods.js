var webppl = Meteor.npmRequire('webppl');

runWebPPLCode = function(code, callback){
  var compiled = webppl.compile(code, true);
  var fn = eval.call(global, compiled);
  fn({}, callback, '');
}

var sampleDelay = function(callback){
  var code = Assets.getText('delay.wppl');
  var compiled = webppl.compile(code, true);
  var fn = eval.call(global, compiled);
  fn({}, function(s,x){
    callback(parseFloat(x));
  }, '');
};

var notificationService = function(once, userId){
  if (notificationsEnabled(userId) || once){
    sampleDelay(function(delay){
      console.log('delay:', delay);
      Meteor.setTimeout(function(){
        console.log('delay over');
        var title = "SampleMe";
        var delayString = moment.utc(delay).format("mm:ss");
        var message = "Hey, " + delayString + " minutes have passed - it's time to check in!";
        App.notificationClient.sendNotification(userId, {
          title: title,
          message: message
        });
        console.log('Notification sent:', message);
        if (!once){
          notificationService(false, userId);
        }
      }, delay);
      return 'notificationService running, next delay: ' + delay / (1000*60);
    });    
  }
};

Meteor.methods({
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
  },
  'startNotificationService': function(once){
    check(this.userId, String);
    var user = Meteor.user();    
    return notificationService(once, user._id);
  }
});
