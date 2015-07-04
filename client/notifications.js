Template.notifications.events({
  'click [data-action="send-notification"], submit': function (event, template) {
    event.preventDefault();
    Meteor.call('startNotificationService', true, function(err, res) {
      if (err) {
	console.log(err);
      } else {
        console.log('res', res);
      }
    });    
  }
});

Template.notifications.helpers({
  notificationsEnabled: notificationsEnabled
});

Template.notifications.rendered = function(){
  $.material.init(); // necessary to get material bootstrap checkbox to render
};

Template.notifications.events({
  "click #notificationsEnabled": function (e) {
    // Set the checked property to the opposite of its current value
    var newNotificationsEnabled = $(e.target).is(':checked');
    var currentUserId = Meteor.user()._id;
    var settings = NotificationSettings.findOne({userId: currentUserId});
    if (settings === undefined){
      NotificationSettings.insert({
        userId: currentUserId,
        notificationsEnabled: newNotificationsEnabled
      });
    } else {
      NotificationSettings.update(settings._id, {$set: {notificationsEnabled: newNotificationsEnabled}});
      if (newNotificationsEnabled){
        Meteor.call('startNotificationService', function(err, res) {
          if (err) {
	    console.log(err);
          } else {
            console.log('res', res);
          }
        });
      }
    }
  },
});
