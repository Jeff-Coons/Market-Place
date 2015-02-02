Final.User = DS.Model.extend({
  userType: DS.attr('string'),
  name: DS.attr('string'),
  email: DS.attr('string'),
  jobs: DS.hasMany('job', {async: true}),
  profile: DS.belongsTo('profile', {async: true}),
  bids: DS.hasMany('bid', {async: true}),
  // messages: DS.hasMany('message', {async: true})
});
