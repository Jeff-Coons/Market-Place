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
