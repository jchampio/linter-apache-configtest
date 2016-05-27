'use babel';

import { CompositeDisposable } from 'atom';

export default {

  subscriptions: null,

  activate(state) {
    require('atom-package-deps').install('linter-apache-configtest');

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  provideLinter() {
    const provider = {
      name: 'Apache ConfigTest',
      grammarScopes: ["source.apache-config"],
      scope: 'file',
      lintOnFly: false,
      lint: async (textEditor) => {
        const helpers = require('atom-linter');
        const filePath = textEditor.getPath();
        const range = helpers.rangeFromLineNumber(textEditor, 0, 0);

        var message = {
          type: 'Warning',
          text: "I am not implemented yet " + Math.random(),
          filePath,
          range
        };
        console.log(message);

        return [message];
      }
    };

    return provider;
  }

};
