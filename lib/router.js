Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', {name: 'sampler'});
Router.route('/dashboard', {name: 'dashboard'});
