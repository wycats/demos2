import Ember from 'ember';

export default Ember.Component.extend({
  didReceiveAttrs() {
    let up = this.day.up;
    this.set('color', up ? '#8cc665' : '#ccc');
    this.set('memo', up ? 'Servers operational!' : 'Red alert!');
  }
});
