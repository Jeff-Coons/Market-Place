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
