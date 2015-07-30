Template.notificationSettings.events({
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

Template.notificationSettings.helpers({
  notificationsEnabled: notificationsEnabled
});

Template.notificationSettings.rendered = function(){
  $.material.init(); // necessary to get material bootstrap checkbox to render
};

Template.notificationSettings.events({
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

Template.trackerSettings.helpers({

  trackerOntology: function(){
    var tree = TrackerTrees.findOne({userId: Meteor.user()._id});
    if (!tree){
      createTrackerOntology();
      return 'Creating ontology...';
    } else {
      return JSON.stringify(tree.json, null, 2);
    }
  }
  
});

Template.trackerSettings.events({
  'submit .trackerSettings': function(e) {
    e.preventDefault();
    var jsonString = $('#tracker-ontology').val();
    var validJSON = true;
    try {
      var json = $.parseJSON(jsonString);      
    } catch(e) {
      alert('Invalid JSON! See console log for details.');
      validJSON = false;
      throw e;
    }
    if (validJSON) {
      var oldTrackerTree = TrackerTrees.findOne({userId: Meteor.user()._id});
      TrackerTrees.update(
        oldTrackerTree._id,
        {$set: {json: json}},
        function(err){
          if (err) {
            alert('Failed to save new tracker ontology: ' + err);
            console.error(err);
          } else {
            alert('Success! Updated tracker ontology.');
          }
        });
    }
  }
});
