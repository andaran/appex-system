/* React */
import React from 'react';

import CodeMirror from "codemirror";

/* Component */
export default class CodeEditor extends React.Component {
  constructor(props) {
    super(props);

    this.oldValue = '';
    this.autocompleteSymbolsHTML = [/<\//, /<\w/];
    this.autocompleteSymbolsCSS = [/[a-z]+/, /:\s+/];
    this.autocompleteSymbolsJS = [/undefined[a-z]+/, /\s+[a-z]/, /[a-z]\.+/];
    this.noAutocompleteFlag = false;

    this.linesLength = [];

    // bind
    this.autocomplete = this.autocomplete.bind(this);
  }

  render() {
    return (
      <div className={`code-editor code-editor-${ this.props.type }`}>
        <div className="code-editor__text">{ this.props.message }</div>
        <textarea name="code" id={ this.props.id }></textarea>
      </div>
    );
  }

  componentDidMount() {
    this.editor = CodeMirror.fromTextArea(document.getElementById( this.props.id ), {
      lineNumbers: true,
      matchBrackets: true,
      mode: this.props.type,
      indentUnit: 4,
      theme: 'darcula',
      extraKeys: {"Ctrl-Space": "autocomplete"},
    });

    this.editor.on('change', this.autocomplete);
    this.editor.setValue( this.props.code );
  }

  autocomplete() {
    /* find symbol before cursor */
    let value = this.editor.getValue();
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

    /* autocomplete brackets */
    // if (/(\w|\s){+/.test(findChar) && !this.noAutocompleteFlag) {
    //   this.editor.setValue(value + '  }');
    //   this.editor.setCursor({line, ch: ch + 1});
    // }

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