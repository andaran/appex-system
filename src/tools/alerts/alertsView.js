import { request } from '../apiRequest/apiRequest';



/*   ---==== AlertsView ====---   */

export default class AlertsView {
  constructor(mess, component, fetchUser) {
    this.mess = mess;
    this.component = component;
    this.fetchUser = fetchUser;

    // bind
    this.check = this.check.bind(this);
    this.find = this.find.bind(this);
    this.step = this.step.bind(this);
    this.end = this.end.bind(this);
  }

  run() {
    const chains = this.find(this.mess);
    if (!chains.config) { return false; }
    this.chains = chains.alertChains;

    const alerts = [];

    chains.alertChains.forEach(elem => {
      if (elem.type !== 'CONFIGURATION') { alerts.push(elem); }
    });

    document.documentElement.style.overflow = 'hidden';
    this.step(alerts);
  }

  check(chain) {
    return chain.find(elem => elem.type === 'CONFIGURATION'
      && elem.component === this.component);
  }

  find(chains) {
    let config = false;
    let alertChains = false;
    for (const chain of chains) {
      if (this.check(chain)) {
        config = this.check(chain);
        alertChains = chain;
        break;
      }
    }
    return { config, alertChains };
  }

  sendAlert(conf) {

    /* generate alert */
    const elem = document.createElement('div');
    elem.id = 'system-alert-wrap';
    elem.innerHTML = `
        <div id="system-alert">
            <div id="system-alert__main">
                <h4>${ conf.title }</h4>
                ${ conf.text }
            </div>
            <div id="system-alert__buttons">
                <div id="button-close">закрыть</div>
                <div id="button-next">далее</div>
            </div>
        </div>  
    `
    document.getElementById('root').append(elem);
    return elem;
  }

  sendPopUp(conf) {

    /* highlight target */
    const target = document.querySelector(conf.target);
    if (!target) { return false; }

    target.classList.add('top-index');

    /* generate pop up */
    const elem = document.createElement('div');
    elem.id = 'system-pop-up-wrap';
    elem.innerHTML = `
        <div id="system-pop-up">
            <div id="system-pop-up-corner-wrap"> 
                <div id="system-pop-up-corner"></div>
            </div> 
            <div id="system-alert__main">
                ${ conf.text }
            </div>
            <div id="system-alert__buttons">
                <div id="button-close">закрыть</div>
                <div id="button-next">далее</div>
            </div>
        </div>  
    `
    document.getElementById('root').append(elem);

    /* move pop up */
    const cords = target.getBoundingClientRect();
    const popUp = elem.querySelector("#system-pop-up");
    const corner = elem.querySelector("#system-pop-up-corner");
    const width = document.documentElement.offsetWidth;

    if (cords.right > (width / 2)) {
      corner.style.right = '-10px';
      popUp.style.left = cords.left - popUp.offsetWidth - 30 + 'px';
    } else {
      corner.style.left = '-10px';
      popUp.style.left = cords.right + 30 + 'px';
    }

    const deltaHeight = (popUp.offsetHeight - cords.height) / 2;
    let top = cords.y - deltaHeight;
    if (top < popUp.offsetHeight + 10) { top = popUp.offsetHeight + 10 }
    popUp.style.top = top + 'px';

    return elem;
  }

  end() {
    request('/api/remove_alerts_chains', { chains: this.chains })
      .then(res => res.json()).then(body => {
        if (body.status === 'ok') {
          this.fetchUser();
        } else {
          console.log('Ahtung in removing alerts chains!');
        }
      }).catch(err => {
        console.log('Ahtung in removing alerts chains!');
      });
  }

  step(alerts) {

    /* add alert and event listeners */
    new Promise((resolve) => {

      /* if alerts chains done */
      if (alerts.length <= 0) { return resolve(false) }

      /* cancel alert */
      const cancel = (elem) => {
        elem.remove();
        const target = document.querySelector('.top-index');
        if (target) { target.classList.remove('top-index'); }
        resolve(false);
      }

      /* next alert */
      const next = (elem) => {
        elem.remove();
        const target = document.querySelector('.top-index');
        if (target) { target.classList.remove('top-index'); }
        resolve(true);
      }

      /* switch alert type */
      const chain = alerts[0];
      let elem;
      switch (chain.type) {
        case 'ALERT':
          elem = this.sendAlert(chain);
          break;
        case 'POP_UP':
          elem = this.sendPopUp(chain);
          break;
        default:
          return resolve(false);
      }

      if (!elem) { resolve(true); }

      const btnNext = elem.querySelector('#button-next');
      const btnCancel = elem.querySelector('#button-close');

      btnNext.onclick = () => next(elem);
      btnCancel.onclick = () => cancel(elem);

    /* if button pressed */
    }).then(ans => {

      /* end or close the alerts */
      if (!ans) { return this.end(); }

      /* go to the next alert */
      alerts.shift();
      this.step(alerts);
    });
  }
}
