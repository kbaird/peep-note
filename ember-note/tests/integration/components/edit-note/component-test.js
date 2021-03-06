import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('edit-note', 'Integration | Component | edit note', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{edit-note}}`);
  assert.equal(this.$().text().trim(), 'save\n  close');
});

test('it renders block text', function(assert) {
  // Template block usage:
  this.render(hbs`
    {{#edit-note}}
      template block text
    {{/edit-note}}
  `);

  var trimmed = this.$().text().trim();
  /* FIXME: This is ugly.
    trimmed.includes fails, even though that's conceptually all we're doing here.
  */
  assert.equal(trimmed.match(/template block text/)[0], 'template block text');
});

test('it renders the notebook title', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  assert.equal('TODO', 'TODO');
});
