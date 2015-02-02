Final.PostJobWorkflow = Ember.Object.extend({
  fetchUser: function() {
    var self = this;
    return this.store.find('user', this.userID)
    .then(function(user) {
      self.set('user', user);
    });
  },

  postJob: function() {
    var config = Ember.merge({
      user: this.user,
    }, this.attributes);
    this.set('job', this.store.createRecord('job',config));
    return this.get('job').save();
  },

  addJobToClient: function() {
    this.get('user.jobs').addObject(this.get('job'));
    return this.get('user').save();
  },

  run: function() {
    return this.fetchUser()
    .then(this.postJob.bind(this))
    .then(this.addJobToClient.bind(this))
  }

});
