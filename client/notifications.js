var sampleDelay = function(callback){
  return runWebPPLCode(
    "exponential(.5) * 2000",
    function(s, delay){
      console.log('Sampled delay using webppl: ', delay);
      return callback(delay);});
};

var continuousNotification = function(){
  // console.log('continuousNotification');
  sampleDelay(
    function(delay){
      console.log('delay:', delay);
      setTimeout(
        function(){
          var title = "SampleMe"; // template.$('[data-field="title"]').val()
          var message = "Hey, it's time to check in!"; // template.$('[data-field="message"]').val()
          Meteor.call('notify', title, message, function(err, res) {
            if (err) {
	      console.log(err);
            } else {
              console.log('res', res);
	      if (res.userCount) {
	        console.log('Notification sent.');
	      }
              // if notifications are enabled
              if (false){
                continuousNotification();
              }
            }
          });
        }, delay);
    });
}

Template.notifications.events({
  'click [data-action="send-notification"], submit': function (event, template) {
    event.preventDefault();    
    continuousNotification();
  }
});

Template.notifications.helpers({
  notificationsEnabled: function(){
    var currentUserId = Meteor.user()._id;
    var settings = NotificationSettings.findOne({userId: currentUserId});
    if (settings === undefined){
      NotificationSettings.insert({
        userId: currentUserId,
        notificationsEnabled: false
      });
      return false;
    } else {
      return settings.notificationsEnabled;
    }
  }
});

Template.notifications.rendered = function(){
  $.material.init(); // necessary to get material bootstrap checkbox to render
};

Template.notifications.events({
  "click #notificationsEnabled": function (e) {
    // Set the checked property to the opposite of its current value
    var notificationsEnabled = $(e.target).is(':checked');
    var currentUserId = Meteor.user()._id;
    var settings = NotificationSettings.findOne({userId: currentUserId});
    if (settings === undefined){
      NotificationSettings.insert({
        userId: currentUserId,
        notificationsEnabled: notificationsEnabled
      });
    } else {
      NotificationSettings.update(settings._id, {$set: {notificationsEnabled: notificationsEnabled}});
    }
  },
});
