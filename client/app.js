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
      timestamp: new Date()
    };
    alert(JSON.stringify(rating));

    // post._id = Posts.insert(post);
    // Router.go('postPage', post);
  }
});

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY'
});
