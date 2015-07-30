_.extend(App, {});

App.helpers = {

  user: function(){
    return Meteor.user();
  }
  
};

_.each(App.helpers, function (helper, key) {
  UI.registerHelper(key, helper);
});
