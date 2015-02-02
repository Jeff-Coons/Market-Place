Final.CreateProfileRoute = Ember.Route.extend({
  beforeModel: function(){
    var user = this.controllerFor('application').get('currentUser.userType');
    console.log(user);
    if (user ===  'client') {
      console.log(true);
    } else {
      this.transitionTo('index');
    }
  }
});

Final.ClientProfileMyRoute = Ember.Route.extend({
  beforeModel: function(){
    var user = this.controllerFor('application').get('currentUser.userType');
    console.log(user);
    if (user ===  'client') {
      console.log(true);
    } else {
      this.transitionTo('index');
    }
  },

  model: function(params) {
    return this.store.find('user', params.user_id);
  }
});

Final.ClientMyJobsRoute = Ember.Route.extend({
  beforeModel: function(){
    var user = this.controllerFor('application').get('currentUser.userType');
    console.log(user);
    if (user ===  'client') {
      console.log(true);
    } else {
      this.transitionTo('index');
    }
  },

  model: function(){
    return this.controllerFor('application').get('currentUser.jobs');
  }
});

Final.ClientPostJobRoute = Ember.Route.extend({
  beforeModel: function(){
    var user = this.controllerFor('application').get('currentUser.userType');
    console.log(user);
    if (user ===  'client') {
      console.log(true);
    } else {
      this.transitionTo('index');
    }
  }
});

Final.ProfileClientStaticRoute = Ember.Route.extend({
  model: function(params) {
    return this.store.find('user', params.user_id);
  }
});

Final.CommunicationJobRoute = Ember.Route.extend({
  beforeModel: function(){
    var user = this.controllerFor('application').get('currentUser');
    if (!user) {
      this.transitionTo('index');
    }
  },

  model: function(params){
    return this.store.find('job', params.job_id);
  }
});
