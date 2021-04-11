
export default class LastApps {
  constructor() {
    this.apps = [];
    this.index = 0;
  }

  append(app) {

    if (this.apps[this.apps.length - 1] === app) { return; }

    if (this.apps.length < 10) {
      this.apps.push(app);
    } else {
      this.apps.shift();
      this.apps.push(app);
    }
    this.index = this.apps.length - 1;
  }

  left() {
    if (this.index > 0) {
      this.index --;
      return this.apps[this.index];
    }
    return false;
  }

  right() {
    if (this.index < this.apps.length - 1) {
      this.index ++;
      return this.apps[this.index];
    }
    return false;
  }
}

const list = new LastApps;

export { list };
