window.Final = Ember.Application.create({
  LOG_TRANSITIONS: true
});

Final.ref = new Firebase('https://final-project-1.firebaseio.com/');

Final.ApplicationAdapter = DS.FirebaseAdapter.extend({
  firebase: Final.ref
});

Final.initializer({
  name: 'firebase-session',

  initialize: function(container, application){
    application.deferReadiness();
    var token = localStorage.getItem('userAuth');
    if (token) {
      var session = container.lookup('controller:application');
      session.authWithToken(token).then(function(){
        application.advanceReadiness();
      });
    } else {application.advanceReadiness();}
  }
});

Ember.Handlebars.helper('date-format', function(date) {
  return moment(date).fromNow();
});

Final.Router.map(function(){

  /* ============ General ============ */

  this.route('home');


  this.resource('signup', function () {
    this.route('client');
    this.route('freelancer');
  });

  this.resource('login', function() {
    this.route('client');
    this.route('freelancer');
  });


  /* ============ Client ============ */

  this.resource('profile-client', function() {
    this.route('static', {path: '/:user_id'});
  });
  this.resource('client', function(){
    this.route('post-job');
    this.route('my-jobs');
    this.resource('client-profile', function(){
      this.route('create');
      this.route('my', {path: '/:user_id'});
    });
  });


  /* ============ Freelance ============ */
  this.resource('profile-freelancer', function () {
    this.route('static', {path: ':user_id'});
  });

  this.resource('freelancer', function () {
    this.route('jobs');
    this.route('my-bids', {path: '/:user_id/my-bids'});
    this.resource('profile', function () {
      this.route('create');
      this.route('my', {path: '/:user_id'});
    });
  });


  /* ============ Chat ============ */

  this.resource('communication', function(){
    this.route('job', {path: '/:job_id'});
  });
});

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

Final.User = DS.Model.extend({
  userType: DS.attr('string'),
  name: DS.attr('string'),
  email: DS.attr('string'),
  jobs: DS.hasMany('job', {async: true}),
  profile: DS.belongsTo('profile', {async: true}),
  bids: DS.hasMany('bid', {async: true}),
  // messages: DS.hasMany('message', {async: true})
});

Final.Job = DS.Model.extend({
  user: DS.belongsTo('user', {async: true}),
  typeOfProject: DS.attr('string'),
  projectScope: DS.attr('string'),
  feDeveloper: DS.attr('string'),
  beDeveloper: DS.attr('string'),
  webDesigner: DS.attr('string'),
  graphicDesigner: DS.attr('string'),
  copywriter: DS.attr('string'),
  bids: DS.hasMany('bid', {async: true}),
  messages: DS.hasMany('message', {async: true})
});

Final.Bid = DS.Model.extend({
  user: DS.belongsTo('user', {async: true}),
  job: DS.belongsTo('job', {async: true}),
  bidSent: DS.attr('boolean'),
  accepted: DS.attr('boolean'),
});

Final.Message = DS.Model.extend({
  message: DS.attr('string'),
  date: DS.attr('date'),
  user: DS.belongsTo('user', {async: true}),
  job: DS.belongsTo('job', {async: true})
});

Final.Profile = DS.Model.extend({
  name: DS.attr('string'),
  bio: DS.attr('string'),
  rate: DS.attr('number'),
  avatar: DS.attr('string'),
  coverPhoto: DS.attr('string'),
  user: DS.belongsTo('user'),
  info: DS.attr('string'),
  email: DS.attr('string'),
  number: DS.attr('string'),
  type: DS.attr('string')
});

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

Final.ClientMyJobsController = Ember.ArrayController.extend({
  needs: ['application'],
  user: Ember.computed.alias('controllers.application.currentUser'),
  itemController: 'jobItem',
  // Need to each over the bids associated to the specific job
  // When a bid is accepted then th rest are automatically rejected
  // All bids will need to be removed, except for the winning bid

});

Final.JobItemController = Ember.ObjectController.extend({
  needs: ['application'],
  acceptedBids: Ember.computed.filterBy('bids', 'accepted', true),

  // Use a computed filterby to go through the bids and show the accepted bid
  // Using an if/else statement to show the items if no bid has been accepted

});

Final.BidItemController = Ember.ObjectController.extend({
  needs: ['application'],

  actions: {

    acceptBid: function() {
      var accept = this.model;
      accept.set('accepted', true);
      accept.save();
    }
  }
});

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

Final.LoginClientController = Ember.Controller.extend({
  needs: ['application'],
  currentUser: Ember.computed.alias('controllers.application.currentUser'),
  actions: {

    login: function(){
      var self = this;
      var credentials = this.getProperties('email', 'password');
      var user = this.get('controllers.application.currentUser');
      this.get('controllers.application').authenticate(credentials).then(function(){
        var user = self.get('controllers.application.currentUser');
        self.transitionToRoute('client-profile.my', user.id);
      });

    }

  }

});

Final.ClientPostJobController = Ember.Controller.extend({
  needs: 'application',
  user: Ember.computed.alias('controllers.application.currentUser'),

  actions: {
    createJob: function(){
      var self = this;
      var workflow = Final.PostJobWorkflow.create({
        attributes: {
          typeOfProject: this.get('typeOfProject'),
          projectScope: this.get('projectScope'),
        },
        store: this.get('store'),
        userID: this.get('user.id')
      });
      workflow.run();
      self.transitionToRoute('client.my-jobs');
    }
  }

});

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

Final.ClientProfileMyController = Ember.ObjectController.extend({
  needs: ['application'],

  actions: {
    logOut: function(){
      this.set('currentUser', null);
      localStorage.removeItem('userAuth');
      Final.ref.unauth();
      this.transitionToRoute('index');
    }
  }
});

Final.ProfileClientStaticController = Ember.ObjectController.extend({
  needs: ['application'],

  actions: {
    logOut: function(){
      this.set('currentUser', null);
      localStorage.removeItem('userAuth');
      Final.ref.unauth();
      this.transitionToRoute('index');
    }
  }
});

Final.CommunicationJobController = Ember.ObjectController.extend({
  needs: 'application',
  newMessage: '',

  actions: {
    postMessage: function () {
      var user = this.get('controllers.application.currentUser');
      var self = this;
      var message = self.store.createRecord('message', {
        message: self.get('newMessage'),
        date: new Date(),
        user:user,
      });
      message.save();
      self.get('model.messages').addObject(message);
      self.get('model').save()
      self.set('newMessage','');
    }
  }
});

Final.FreelancerController = Ember.Controller.extend({
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

Final.FreelancerJobsController = Ember.ArrayController.extend({
  needs: ['application'],
  user: Ember.computed.alias('controllers.application.currentUser'),
  itemController: 'job',
});

Final.JobController = Ember.ObjectController.extend({
  needs: ['application'],

  init: function() {
    this._super();

    // if the job has a bid.id that matches the user's bid.id
    // set placedBid to true

    var model = this.get('model');
    var jobs = model.serialize();
    var bidsID = jobs.bids;

    var user = this.get('controllers.application.currentUser');
    var userInfo = user.serialize();
    var userBids = userInfo.bids;

    var hasBid = Ember.Object.createWithMixins({
      jobBid: bidsID,
      userBid: userBids,
      bidsInCommon: Ember.computed.intersect('jobBid', 'userBid')
    });

    var common = hasBid.get('bidsInCommon');
    var result = !!common.length;


    if (result === true) {
      this.set('placedBid', true);
    }

  },

  actions: {

    placeBid: function () {
      var user = this.get('controllers.application.currentUser');
      var jobs = this.get('model');

      var bid = this.store.createRecord('bid', {
        bidSent: true,
        user: user,
        job: jobs,
        // accepted: false
      });

      bid.save();

      user.get('bids').addObject(bid);
      user.save();
      jobs.get('bids').addObject(bid);
      jobs.save();
      this.set('placedBid', true);
    }
  },

  placedBid: false,
});

Final.FreelancerJobsController = Ember.ArrayController.extend({
  needs: ['application'],
  user: Ember.computed.alias('controllers.application.currentUser'),
  itemController: 'job',
});

Final.JobController = Ember.ObjectController.extend({
  needs: ['application'],

  init: function() {
    this._super();

    // if the job has a bid.id that matches the user's bid.id
    // set placedBid to true

    var model = this.get('model');
    var jobs = model.serialize();
    var bidsID = jobs.bids;

    var user = this.get('controllers.application.currentUser');
    var userInfo = user.serialize();
    var userBids = userInfo.bids;

    var hasBid = Ember.Object.createWithMixins({
      jobBid: bidsID,
      userBid: userBids,
      bidsInCommon: Ember.computed.intersect('jobBid', 'userBid')
    });

    var common = hasBid.get('bidsInCommon');
    var result = !!common.length;


    if (result === true) {
      this.set('placedBid', true);
    }

  },

  actions: {

    placeBid: function () {
      var user = this.get('controllers.application.currentUser');
      var jobs = this.get('model');

      var bid = this.store.createRecord('bid', {
        bidSent: true,
        user: user,
        job: jobs,
        // accepted: false
      });

      bid.save();

      user.get('bids').addObject(bid);
      user.save();
      jobs.get('bids').addObject(bid);
      jobs.save();
      this.set('placedBid', true);
    }
  },

  placedBid: false,
});

Final.ProfileMyController = Ember.ObjectController.extend({
  needs: ['application'],

  actions: {
    logOut: function(){
      this.set('currentUser', null);
      localStorage.removeItem('userAuth');
      Final.ref.unauth();
      this.transitionToRoute('index');
    }
  }
});

Final.ProfileFreelancerStaticController = Ember.ObjectController.extend({
  needs: ['application'],

  actions: {
    logOut: function(){
      this.set('currentUser', null);
      localStorage.removeItem('userAuth');
      Final.ref.unauth();
      this.transitionToRoute('index');
    }
  }
});

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

Final.FreelancerMyBidsController = Ember.ArrayController.extend({
  needs: ['application'],
  user: Ember.computed.alias('controllers.application.currentUser'),
});

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
