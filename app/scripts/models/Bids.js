Final.Bid = DS.Model.extend({
  user: DS.belongsTo('user', {async: true}),
  job: DS.belongsTo('job', {async: true}),
  bidSent: DS.attr('boolean'),
  accepted: DS.attr('boolean'),
});
