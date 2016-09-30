import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';
import DS from 'ember-data';


moduleFor('serializer:application', 'Unit | Serializer | application', {
  // Specify the other units that are required for this test.
});

// TODO: Re-activate this once switched over to JSONAPI[Adapter|Serializer]
//test('it serializes records in JSON Api format', function(assert) {
test('it serializes records', function(assert) {

  // create a dummy model for application
  let DummyModel = DS.Model.extend({
    name:    DS.attr('string'),
    address: DS.attr('string')
  });
  this.registry.register('model:application', DummyModel);

  let store = Ember.getOwner(this).lookup('service:store');

  let basicModel = {
    name:    'Test Name',
    address: 'SOme Dummy Address'
  };

  let JsonApiHash = {
    data: {
      attributes: {
        name:    basicModel.name,
        address: basicModel.address
      },
      type: 'applications'
    }
  };
  let expectedHash = JsonApiHash.data.attributes;

  Ember.run(function(){

    // Create an instance of DummyModel and serialize
    let serializedRecord = store.createRecord('application', basicModel).serialize();
    assert.deepEqual(serializedRecord, expectedHash);

  });

});
