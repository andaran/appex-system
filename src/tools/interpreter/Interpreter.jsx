/* React */
import React from 'react';

import Button from '../button/Button';

import App from './App';

/* Component */
export default class Interpreter extends React.Component {
  constructor(props) {
    super(props);

    // bind
    this.renderApp = this.renderApp.bind(this);
  }

  render() {
    /* render app */
    process.nextTick(() => this.renderApp());

    /* render app wrap */
    return <div className="interpreter" id={ this.props.id }/>;
  }

  renderApp() {

    /**
     * Appex interpreter v1 by https://github.com/andaran
     **/

    /*   ---==== Parse presets ====---   */

    /* parsing */
    let html = this.props.app.code.html;
    html = html.split(']]');
    html = html.map(item => {
      return {
        code: item.split('[[')[0],
        preset: item.split('[[')[1],
      }
    });

    /* add presets */
    html = html.map(item => {

      /* if preset is being */
      if (item.preset !== undefined) {
        const presetText = item.preset.replaceAll('\n', '');
        let args = presetText.match(/\w+\s?="[^"]+"/g);
        let type = presetText.match(/^\s*\w+\s/g)[0]
          .replaceAll(' ', '')
          .toLowerCase();


        /* if no args */
        if (args === null) { return { code: item.code, preset: { type, args: [] } }; }

        /* parse arguments */
        args = args.map(item => {
          let name = item.match(/^\w+/g)[0];
          let value = item.match(/".*"/g)[0];
          value = value.substring(1, value.length - 1);
          return { name, value }
        });

        return { code: item.code, preset: { type, args } };
      } else {
        return { code: item.code, preset: false };
      }
    });



    /*   ---==== Add presets ====---   */

    let finallyCode = '';
    let promises = [];

    /* fetch presets html */
    for (let item of html) {

      /* if preset is here  */
      if (item.preset) {
        // console.log(item.preset);
        promises.push(fetch(`../presets/${item.preset.type}.hbs`)
          .then(response => response.text())
          .then(text => {
            let presetHtml = text;
            item.preset.args.forEach(arg => {
              presetHtml = presetHtml.replaceAll(`{{ ${arg.name} }}`, arg.value);
            });
            // console.log('REPLACED:', presetHtml);

            /* add this html to another code */
            return item.code + presetHtml;
          }));

      /* else if preset is empty  */
      } else {
        /* send promise with code without preset */
        promises.push(new Promise(resolve => resolve( item.code )));
      }
    }

    Promise.all(promises).then((codeArr) => {

      /* concat everything together */
      codeArr.forEach((blockOfCode) => {
        finallyCode += blockOfCode;
      });
      // console.log(finallyCode);

      /* create code variable with styles */
      let code = `<div id="app">\n<style>\n ${ this.props.app.code.css } \n</style>\n`;

      /* add main code */
      code += `${ finallyCode } \n</div>`;

      /* render all of this !!! */
      document
        .getElementById( this.props.id )
        .innerHTML = code;
    });



    /*/!*   ---==== Play JS ====---   *!/

    const app = new App( this.props.app );

    let appJS = new Function('App', this.props.app.code.js);
    appJS(app);
    appJS = null;*/
  }
}