Final.SignupFreelancerController = Ember.Controller.extend({
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
              userType: 'freelancer',
              name: credentials.name,
              email: credentials.email
            });
            user.save();
            self.transitionToRoute('profile.create');
          });
        } else {
          console.log(error);
        }
      });
    }
  }

});
