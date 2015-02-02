Final.ProfileEditController = Ember.Controller.extend({
  needs: ['application'],

  actions: {
    // saveProfile: function() {
    //  var info = this.get({
    //     'name',
    //     'avatar',
    //     'rate',
    //     'bio'
    //   });
    //   //this.set
    // },

    logOut: function(){
      this.set('currentUser', null);
      localStorage.removeItem('userAuth');
      Final.ref.unauth();
      this.transitionToRoute('index');
    }
  }

});
