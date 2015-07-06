Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function(){
    return [Meteor.subscribe('events'), Meteor.subscribe('notificationSettings')];
  }
});

Router.route('/', {name: 'sampler', fastRender: true});
Router.route('/data', {name: 'data', fastRender: true});
Router.route('/notifications', {name: 'notifications', fastRender: true});
