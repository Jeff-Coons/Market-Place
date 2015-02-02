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
