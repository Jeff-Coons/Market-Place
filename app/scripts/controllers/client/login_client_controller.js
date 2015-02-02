Final.LoginClientController = Ember.Controller.extend({
  needs: ['application'],
  currentUser: Ember.computed.alias('controllers.application.currentUser'),
  actions: {

    login: function(){
      var self = this;
      var credentials = this.getProperties('email', 'password');
      var user = this.get('controllers.application.currentUser');
      this.get('controllers.application').authenticate(credentials).then(function(){
        var user = self.get('controllers.application.currentUser');
        self.transitionToRoute('client-profile.my', user.id);
      });

    }

  }

});
