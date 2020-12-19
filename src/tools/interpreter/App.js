export default class App {
  constructor(app) {
    this.id = app.id;
    this.title = app.title;
    this.settings = app.settings;
  }

  getInfo() {
    console.log(`-== App info ==-\nid: ${this.id}\ntitle: ${this.title}\nsettings: ${this.settings}`);
  }
}