Final.SignupClientController = Ember.Controller.extend({
  needs: ['application'],

  actions: {
    signup: function () {
      var self = this;
      var credentials = this.getProperties('email', 'password', 'name');

      Final.ref.createUser(credentials, function(error){
        if (!error) {
          self.get('controllers.application').authenticate(credentials)
          .then(function (user) {
            user.setProperties ({
              // id: authData.uid,
              name: credentials.name,
              userType: 'client',
              email: credentials.email,
            });
            user.save();
          });
          self.transitionToRoute('client-profile.create');
        } else {
          console.log(error);
        }
      });
    }
  }
});
