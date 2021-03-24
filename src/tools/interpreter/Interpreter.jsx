/* React */
import React from 'react';
import { changeAppState } from "../../actions/appStateActions";
import { connect } from "react-redux";
import { app } from "../../socketCore";
import * as Icons from "@fortawesome/free-solid-svg-icons";

/* Component */
class Interpreter extends React.Component {
  constructor(props) {
    super(props);

    // bind
    this.renderApp = this.renderApp.bind(this);
    this.hotkey = this.hotkey.bind(this);
  }

  render() {
    /* render app */
    process.nextTick(() => this.renderApp());

    /* render app wrap */
    return <div className="interpreter" id={ this.props.id }/>;
  }

  renderApp() {

    /*

      Appex interpreter v1 by https://github.com/andaran

    */

    /*   ---==== Parse presets ====---   */

    /* render mode */
    let appSourceCode;
    this.props.devMode
      ? appSourceCode = this.props.app.code
      : appSourceCode = this.props.app.releaseCode;

    /* parsing */
    let html = appSourceCode.html;

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

        /* parse type */
        let type;
        try {
          type = presetText.match(/^\s*\w+\s/g)[0]
            .replaceAll(' ', '')
            .toLowerCase();
        } catch(e) {
          return { code: item.code, preset: false };
        }

        /* parse args */
        let args;
        try {
          args = presetText.match(/\w+\s?="[^"]+"/g);
        } catch (e) {
          args = null;
        }

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

        /* switch preset type */
        switch (item.preset.type) {
          case 'icon':

            /* find icon or return promise with code without preset */
            const iconArgs = item.preset.args.find(arg => arg.name === 'name');
            if (iconArgs === undefined) {
              promises.push(new Promise(resolve => resolve( item.code )));
              break;
            }

            /* if icon not found, return promise with code without preset */
            const icon = Icons[iconArgs.value];
            if (icon === undefined) {
              promises.push(new Promise(resolve => resolve( item.code )));
              break;
            }

            /* set new args */
            const args = [
              { name: 'name', value: icon.iconName },
              { name: 'vb1', value: icon.icon[0] },
              { name: 'vb2', value: icon.icon[1] },
              { name: 'd', value: icon.icon[4] },
              { name: 'prefix', value: icon.prefix },
            ];
            item.preset.args = args;

          default:
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
            break;
        }

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
      let code = `<div id="app">\n<style>\n ${ appSourceCode.css } \n</style>\n`;

      /* add main code */
      code += `${ finallyCode } \n</div>`;

      /* render all of this !!! */
      document
        .getElementById( this.props.id )
        .innerHTML = code;

      /* play JS */
      if (this.props.appState === 'opened' || this.props.appState === 'opened_dev') {

        /* find room settings */
        const id = this.props.appId;
        const settings = this.props.user.settings.find(elem => elem.id === id);

        /* set socketCore class */
        app.app = this.props.app;
        app.roomSettings = settings;

        /* start! */
        try {
          this.appJS = Function( 'App', appSourceCode.js );
          this.appJS(app);
        } catch(e) { console.error('Ошибка запуска приложения!! \n\n', e); }
      } else {
        app.exit();
      }
    });
  }

  componentDidMount() {
    document.addEventListener('keydown', this.hotkey);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.hotkey);
  }

  hotkey(event) {

    /* update interpreter */
    if (event.ctrlKey && event.code === 'KeyS' && this.props.devMode) {
      event.preventDefault();
      process.nextTick(() => this.forceUpdate());
      return false;
    }
  }
}



/*   ---==== Connect to redux ====---   */

function mapStateToProps(store) {
  return {

    /* user */
    user: store.userData.user,

    /* app state */
    appState: store.appState.state,
    appId: store.appState.id,
    appType: store.appState.type,

  }
}

function mapDispatchToProps(dispatch) {
  return {
    changeAppState: (changedState) => {
      dispatch(changeAppState(changedState))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Interpreter);