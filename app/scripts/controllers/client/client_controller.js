Final.ClientController = Ember.Controller.extend({
  needs: ['application'],
  user: Ember.computed.alias('controllers.application.currentUser'),

  actions: {
    logOut: function () {
      this.set('currentUser', null);
      localStorage.removeItem('userAuth');
      Final.ref.unauth();
      this.transitionToRoute('index');
    }
  }

});
