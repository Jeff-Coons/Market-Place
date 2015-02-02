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
