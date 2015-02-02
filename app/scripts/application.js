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
