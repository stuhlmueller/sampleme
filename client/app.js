_.extend(App, {
});

App.helpers = {
  user: function(){return Meteor.user();}
};

_.each(App.helpers, function (helper, key) {
  Handlebars.registerHelper(key, helper);
});

Template.ratingForm.onRendered(function(){
  $('.slider').slider();
});

Template.notificationTest.events({
  'click [data-action="send-notification"], submit': function (event, template) {
    event.preventDefault();
    var title = "SampleMe"; // template.$('[data-field="title"]').val()
    var message = "Hey, it's time to check in!"; // template.$('[data-field="message"]').val()
    var delay = 10 * 1000;
    setTimeout(
      function(){
        Meteor.call('notify', title, message, function(err, res) {
          if (err) {
	    console.log(err);
          } else {
	    if (res.userCount) {
	      console.log('Notification sent.');
	    }
          }
        });
      }, delay);
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
    return Ratings.find({userId: Meteor.user()._id},
                        {sort: {timestamp: -1}});
  }
});

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY'
});
