Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', {name: 'sampler'});
Router.route('/data', {name: 'data'});
Router.route('/notifications', {name: 'notifications'});
