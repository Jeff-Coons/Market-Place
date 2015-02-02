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
