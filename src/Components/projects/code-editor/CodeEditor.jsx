/* React */
import React from 'react';

import CodeMirror from "codemirror";
import emmet from '@emmetio/codemirror-plugin';
import { changeProjects } from "../../../actions/projectsActions";
import { connect } from "react-redux";

emmet(CodeMirror);

/* Component */
class CodeEditor extends React.Component {
  constructor(props) {
    super(props);

    this.oldValue = '';
    this.autocompleteSymbolsHTML = [/<\//, /<\w/];
    this.autocompleteSymbolsCSS = [/[a-z]+/, /:\s+/];
    this.autocompleteSymbolsJS = [/undefined[a-z]+/, /\s+[a-z]/, /[a-z]\.+/];

    this.linesLength = [];
    this.awaitKey = false;

    // bind
    this.autocomplete = this.autocomplete.bind(this);
    this.keydown = this.keydown.bind(this);
    this.save = this.save.bind(this);
  }

  render() {
    return (
      <div className={`code-editor code-editor-${ this.props.type }`} id={`${ this.props.id }-wrap`}>
        <div className="code-editor__text">{ this.props.message }</div>
        <textarea name="code" id={ this.props.id }/>
      </div>
    );
  }

  componentDidMount() {

    let keys = {'Ctrl-Space': 'autocomplete'};
    if (this.props.type === 'htmlembedded') {
      keys = {
        'Tab': 'emmetExpandAbbreviation',
        'Esc': 'emmetResetAbbreviation',
        'Enter': 'emmetInsertLineBreak',
        'Ctrl-Space': 'autocomplete'
      }
    }

    let minimapSettings = false;
    if (this.props.mode === 'one') {
      minimapSettings = { scale: 6 };
    }

    this.editor = CodeMirror.fromTextArea(document.getElementById( this.props.id ), {
      lineNumbers: true,
      lineWrapping: true,
      matchBrackets: true,
      mode: this.props.type,
      indentUnit: 4,
      theme: 'darcula',
      extraKeys: keys,
      minimap: minimapSettings,
    });

    this.editor.on('change', this.autocomplete);
    this.editor.setValue( this.props.code );

    document.addEventListener('keydown', this.keydown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keydown);
  }

  keydown (event) {
    if ((event.ctrlKey && event.code === 'KeyS') ||
        (event.altKey && (event.code === 'KeyR' || event.code === 'KeyU' || event.code === 'KeyV'))) {
      this.save();
      event.preventDefault();
      return false;
    }
    if (event.ctrlKey && event.code === 'KeyD') {
      this.editor.setValue( this.props.code );
      event.preventDefault();
      return false;
    }
  }

  save() {
    if (this.props.projectsIsFetching) { return; }

    let appNumber;
    this.props.projects.map((project, index) => {
      if (this.props.appId === project.id) {
        appNumber = index;
        return;
      }
    });
    let value = this.editor.getValue();
    let changedProjects = this.props.projects;

    switch (this.props.type) {
      case 'htmlembedded':
        changedProjects[appNumber].code.html = value;
        break;
      case 'css':
        changedProjects[appNumber].code.css = value;
        break;
      case 'javascript':
        changedProjects[appNumber].code.js = value;
        break;
      default:
        console.error('save error! ( 97 )');
    }

    this.props.changeProjects( changedProjects.slice() );

  }

  autocomplete() {

    /* editor value */
    let value = this.editor.getValue();

    /* find symbol before cursor */
    const line = this.editor.doc.getCursor().line;
    const ch = this.editor.doc.getCursor().ch;

    if (!this.linesLength[line]) {
      this.linesLength[line] = value.split('\n')[line].length;
    }

    let findChar = value.split('\n')[line];
    findChar = findChar[ch - 2] + findChar[ch - 1];

    if (value === this.oldValue) { return; }
    if (value.split('\n')[line].length < this.linesLength[line]) {
      this.linesLength[line] = value.split('\n')[line].length;
      return;
    }

    /* autocomplete html */
    if (this.props.type === 'htmlembedded') {
      this.autocompleteSymbolsHTML.forEach(exp => {
        if (exp.test(findChar)) { this.editor.execCommand("autocomplete"); }
      });
    }

    /* autocomplete css */
    if (this.props.type === 'css') {
      if (/{+/.test(findChar)) { return; }
      if (/;+/.test(findChar)) { return; }

      this.autocompleteSymbolsCSS.forEach(exp => {
        if (exp.test(findChar)) { this.editor.execCommand("autocomplete"); }
      });
    }

    /* autocomplete js */
    if (this.props.type === 'javascript') {
      this.autocompleteSymbolsJS.forEach(exp => {
        if (exp.test(findChar)) { this.editor.execCommand("autocomplete"); }
      });
    }

    if (value !== this.oldValue) { this.noAutocompleteFlag = false; }
    this.oldValue = value;
    this.linesLength[line] = value.split('\n')[line].length;
  }
}

function mapStateToProps(store) {
  return {
    projects: store.projects.data,
    projectsIsFetching: store.projects.isFetching,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    changeProjects: ( changedProjects ) => {
      dispatch(changeProjects( changedProjects ))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CodeEditor);