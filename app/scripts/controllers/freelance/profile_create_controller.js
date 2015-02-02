Final.ProfileCreateController = Ember.ArrayController.extend({
  needs: ['application'],
  user: Ember.computed.alias('controllers.application.currentUser'),

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

      var profileInfo = this.store.createRecord('profile', {
        avatar: this.get('addAvatar'),
        coverPhoto: this.get('addCover'),
        name: this.get('name'),
        rate: this.get('rate'),
        bio: this.get('bio'),
        email: this.get('email'),
        number: this.get('number'),
        type: 'freelancer'
      });
      profileInfo.save().then(function(id){
        self.transitionToRoute('profile.my', user.id);
      });
      user.set('profile', profileInfo);
      user.save();

    }

  }
});
