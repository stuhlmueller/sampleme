_.extend(App, {
});

App.helpers = {
  showNotificationForm: function() {
    return (Meteor.user() && !Meteor.isCordova);
  },
  showRatingForm: function() {
    return (Meteor.user() && Meteor.isCordova);
  }
};

_.each(App.helpers, function (helper, key) {
  Handlebars.registerHelper(key, helper);
});

Template.notificationForm.onRendered(function(){
  $('.slider').slider();
});

Template.notificationForm.events({
  'click [data-action="send-notification"], submit': function (event, template) {
    event.preventDefault();
    Meteor.call('notify', template.$('[data-field="title"]').val(), template.$('[data-field="message"]').val(), function(err, res) {
      if (err) {
	console.log(err);
      } else {
	if (res.userCount) {
	  alert('Notification sent.');
	}
      }
    });
  }
});

Template.ratingForm.events({
  'submit form': function(e) {
    e.preventDefault();

    var rating = {
      value: $("#rating").slider('getValue'),
      timestamp: new Date(),
      userId: Meteor.user()._id
    };
    rating._id = Ratings.insert(rating);

    $("#rating").slider();
    // Router.go('postPage', post);
  }
});

Template.ratingsList.helpers({
  ratings: function(){
    return Ratings.find({}, {sort: {timestamp: -1}});
  }
});

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY'
});
