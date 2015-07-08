Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function(){
    return [Meteor.subscribe('events'), Meteor.subscribe('notificationSettings')];
  }
});

Router.route('/', {name: 'sampler'});
Router.route('/data', {name: 'data'});
Router.route('/notifications', {name: 'notifications'});
Router.route('/ndg', {name: 'trackerTree'})
