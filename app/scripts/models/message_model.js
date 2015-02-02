Final.Message = DS.Model.extend({
  message: DS.attr('string'),
  date: DS.attr('date'),
  user: DS.belongsTo('user', {async: true}),
  job: DS.belongsTo('job', {async: true})
});
