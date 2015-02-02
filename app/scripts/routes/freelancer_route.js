Final.ProfileMyRoute = Ember.Route.extend({
  beforeModel: function() {
    var user = this.controllerFor('application').get('currentUser.userType');
    if (user ===  'freelancer') {
      console.log(true);
    } else {
      this.transitionTo('index');
    }
  },

  model: function(params) {
    return this.store.find('user', params.user_id);
  }
});

Final.ProfileCreateRoute = Ember.Route.extend({
  beforeModel: function() {
    var user = this.controllerFor('application').get('currentUser.userType');
    if (user ===  'freelancer') {
      console.log(true);
    } else {
      this.transitionTo('index');
    }
  }

});

Final.ProfileEditRoute = Ember.Route.extend({
  beforeModel: function() {
    var user = this.controllerFor('application').get('currentUser.id');
    if (!user) {
      this.transitionTo('index');
    }
  },

  model: function(params) {
    return this.controllerFor('application').get('currentUser');
  }
});

Final.FreelancerJobsRoute = Ember.Route.extend({
  beforeModel: function() {
    var user = this.controllerFor('application').get('currentUser.userType');
    console.log(user);
    if (user ===  'freelancer') {
      console.log(true);
    } else {
      this.transitionTo('index');
    }
  },

  model: function(){
    return this.store.find('job');
  }
});

Final.FreelancerMyBidsRoute = Ember.Route.extend({
  beforeModel: function() {
    var user = this.controllerFor('application').get('currentUser.userType');
    console.log(user);
    if (user ===  'freelancer') {
      console.log(true);
    } else {
      this.transitionTo('index');
    }
  },

  model: function() {
    return this.controllerFor('application').get('currentUser.bids');
  }
});

Final.ProfileFreelancerStaticRoute = Ember.Route.extend({
  model: function(params) {
    return this.store.find('user', params.user_id);
  }
});
