Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function(){
    return [Meteor.subscribe('events'), Meteor.subscribe('notificationSettings')];
  }
});

Router.route('/', {name: 'tracker', fastRender: true})
Router.route('/data', {name: 'data', fastRender: true});
Router.route('/settings', {name: 'settings', fastRender: true});

Router.route('/sampleme.json', {
  where: 'server',
  name: 'export',
  action: function() {    
    if (this.request.cookies && this.request.cookies.meteor_login_token) {
      var token = this.request.cookies.meteor_login_token;
      var user = Meteor.users.findOne({
        "services.resume.loginTokens.hashedToken": Accounts._hashLoginToken(token)});
      var data = Events.find({userId: user._id}).fetch();
      this.response.write(JSON.stringify(data));
      this.response.end();      
    } else {
      this.response.writeHead(401, {'Content-Type': 'text/html'});
      this.response.write('Access denied.');
      this.response.end();
    }
  }
});
