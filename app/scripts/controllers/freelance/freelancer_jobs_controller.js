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
