Final.ApplicationController = Ember.Controller.extend({
  currentUser: null,

  authenticate: function(credentials) {
    var self = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      Final.ref.authWithPassword(credentials, function(error, authData) {
        self.configureSession(authData).then(resolve, reject);
      });
    });
  },

  configureSession: function(authData) {
    var self = this;
    return new Ember.RSVP.Promise(function(resolve, reject){
      localStorage.setItem('userAuth', authData.token);
      self.store.find('user', authData.uid).then(function(user){
        self.set('currentUser', user);
        resolve(user);
      }, function(error){
        var user = self.store.recordForId('user', authData.uid);
        user.loadedData();
        self.set('currentUser', user);
        resolve(user);
      });
    });
  },

  authWithToken: function(token) {
    var self = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      Final.ref.authWithCustomToken(token, function(error, authData) {
        self.configureSession(authData).then(resolve, reject);
      });
    });
  },

});
