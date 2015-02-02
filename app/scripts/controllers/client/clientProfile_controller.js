Final.ClientProfileCreateController = Ember.Controller.extend({
  needs: ['application'],

  actions: {

    addAvatar: function() {
      var self = this;
      filepicker.setKey("A3T6mDAqcRqWxmPxj0ZJJz");

      filepicker.pickAndStore({
        maxFiles: 1
      },{},function(Blobs){
        self.set('addAvatar', Blobs[0].url);
      });
    },

    addCover: function() {
      var self = this;
      filepicker.setKey("A3T6mDAqcRqWxmPxj0ZJJz");

      filepicker.pickAndStore({
        maxFiles: 1
      },{},function(Blobs){
        self.set('addCover', Blobs[0].url);
      });
    },

    createProfile: function(){
      var self = this;
      var user = this.get('controllers.application.currentUser');
      var profile = this.store.createRecord('profile', {
        avatar: this.get('addAvatar'),
        coverPhoto: this.get('addAvatar'),
        name: this.get('name'),
        bio: this.get('bio'),
        email: this.get('email'),
        number: this.get('number'),
        type: 'client'
      });
      profile.save().then(function(id){
        self.transitionToRoute('client-profile.my', user.id);
      });
      user.set('profile', profile);
      user.save();
    }
  }

});
