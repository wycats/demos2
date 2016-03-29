import Ember from 'ember';

export default Ember.Component.extend({
  didReceiveAttrs() {
    this.set('upDays', this.computeUpDays());
    this.set('streak', this.computeStreak());
  },

  computeUpDays() {
    return this.days.reduce((upDays, day) => {
      return upDays += (day.up ? 1 : 0);
    }, 0);
  },

  computeStreak() {
    let [max] = this.days.reduce(([max, streak], day) => {
      if (day.up && streak + 1 > max) {
        return [streak + 1, streak + 1];
      } else if (day.up) {
        return [max, streak + 1];
      } else {
        return [max, 0];
      }
    }, [0, 0]);

    return max;
  }
});
