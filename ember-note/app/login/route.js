import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    login: function() {
      this.store.query('user', {
        name: this.controller.get('name')
      }).then((users) => {
        if(users.get('length') === 1) {
          var user = users.objectAt(0);
          user.name = this.controller.get('name');
          console.log("name = " + JSON.stringify(this.controller.get('name')));
          console.log("user = " + JSON.stringify(user));
          this.controllerFor('application').set('user', user);
          this.transitionTo('notebooks');
          this.transitionTo('notebooks', user.get('id'));
        }
        else {
          console.log('unexpected query result');
        }
      });
    }
  }
});
