var webppl = Meteor.npmRequire('webppl');

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
        var event = {
          type: 'notification',          
          value: message,
          userId: userId,
          timestamp: new Date()
        };
        Events.insert(event);
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
  'insertEvent': function(eventAttributes){
    check(this.userId, String);
    check(eventAttributes.type, String);
    var user = Meteor.user();
    var event = _.extend(eventAttributes, {
      userId: user._id,
      timestamp: new Date()
    });
    var eventId = Events.insert(event);
    return {
      _id: eventId
    };
  },
  'startNotificationService': function(once){
    check(this.userId, String);
    var user = Meteor.user();    
    return notificationService(once, user._id);
  }
});
