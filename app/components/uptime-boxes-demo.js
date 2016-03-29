import Ember from 'ember';

// let shouldProfile = window.location.search === '?profile';

class ExponentialMovingAverage {
  constructor(alpha) {
    this.alpha = alpha;
    this.lastValue = null;
  }

  value() {
    return this.lastValue;
  }

  push(dataPoint) {
    let { alpha, lastValue } = this;

    if (lastValue) {
      return this.lastValue = lastValue + alpha * (dataPoint - lastValue);
    } else {
      return this.lastValue = dataPoint;
    }
  }
}

export default Ember.Component.extend({

  init() {
    this._super();
    this.set('isPlaying', false);
    this.set('servers', generateServers());
    this.set('fps', null);

    // FIXME: we need the {{action}} helper working
    this.play = this.actions.play.bind(this);
    this.pause = this.actions.pause.bind(this);
    this.raf = null;
  },

  actions: {
    play() {
      this.set('isPlaying', true);

      let lastFrame = null;
      let fpsMeter = new ExponentialMovingAverage(2/121);

      let callback = () => {
        let thisFrame = window.performance.now();

        this.onFrame();

        if (lastFrame) {
          this.set('fps', Math.round(fpsMeter.push(1000 / (thisFrame - lastFrame))));
        }

        // console.time('rerender');
        // if (shouldProfile) { console.profile('rerender'); }
        this.rerender(); // FIXME: Glimmer 2 runloop integration
        // if (shouldProfile) { console.profileEnd('rerender'); }
        // console.timeEnd('rerender');
        this.raf = requestAnimationFrame(callback);

        lastFrame = thisFrame;
      };

      callback();

      lastFrame = null;
    },

    pause() {
      this.set('isPlaying', false);

      cancelAnimationFrame(this.raf);

      this.raf = null;

      this.rerender(); // FIXME: Glimmer 2 runloop integration
    }
  },

  onFrame() {
    this.set('servers', generateServers());
    // updateServers(this.servers);
  },

  willDestroyElement() {
    if (this.raf) {
      cancelAnimationFrame(this.raf);
    }
  }

});

function generateServer(name) {
  let days = [];

  for (let i=0; i<=364; i++) {
    let up = Math.random() > 0.2;
    days.push({ number: i, up });
  }

  return { name, days };
}

function generateServers() {
  return [
    generateServer("Stefan's Server"),
    generateServer("Godfrey's Server"),
    generateServer("Yehuda's Server"),
    // generateServer("Chad's Server"),
    // generateServer("Robert's Server"),

    /*
    generateServer("Robert's Server 1"),
    generateServer("Robert's Server 2"),
    generateServer("Robert's Server 3"),
    generateServer("Robert's Server 4"),
    generateServer("Robert's Server 5"),
    generateServer("Robert's Server 6")
    */
  ];
}

function updateServer(server) {
  let days = server.days;

  for (let i=0; i<=364; i++) {
    Ember.set(days[i], 'up', Math.random() > 0.2);
  }
}

function updateServers(servers) {
  for (let i=0, l=servers.length; i<l; i++) {
    updateServer(servers[i]);
  }
}

