_.extend(App, {
  promptToggleVal: false
});

App.helpers = {
  user: function(){return Meteor.user();}
};

_.each(App.helpers, function (helper, key) {
  UI.registerHelper(key, helper);
});

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY'
});
