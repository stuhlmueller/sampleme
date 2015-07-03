Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function(){
    return [Meteor.subscribe('ratings')];
  }
});

Router.route('/', {name: 'sampler'});
Router.route('/data', {name: 'data'});
Router.route('/notifications', {name: 'notifications'});
