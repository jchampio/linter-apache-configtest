'use babel';

import { CompositeDisposable } from 'atom';
import ConfigTestParser from './parser';

export default {

  config: {
    apachectl: {
      title: 'ConfigTest Executable',
      description: 'Name of (or path to) the executable performing the ' +
        'configtest (most likely `apachectl`, `httpd`, or `apache2`).',
      type: 'string',
      default: 'apachectl'
    }
  },

  subscriptions: null,

  activate(_state) {
    require('atom-package-deps').install('linter-apache-configtest');

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(
      atom.config.observe('linter-apache-configtest.apachectl', apachectl => {
        this.apachectl = apachectl;
      })
    );
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  provideLinter() {
    const helpers = require('atom-linter');

    return {
      name: 'Apache ConfigTest',
      grammarScopes: ["source.apache-config"],
      scope: 'file',
      lintOnFly: false,
      lint: async (textEditor) => {
        const filePath = textEditor.getPath();

        // Execute the configtest.
        let execOptions = { stream: 'both', throwOnStdErr: false };
        const args = ['-t', '-f', filePath];
        let result = await helpers.exec(this.apachectl, args, execOptions);

        // Parse the results.
        let failed = (result.exitCode != 0);
        let messages = ConfigTestParser.parse(failed, result.stderr);

        // Remap the line numbers returned from the parser to proper ranges
        // before handing them back to the linter.
        return messages.map((msg) => {
          msg.range = helpers.rangeFromLineNumber(textEditor, msg.range - 1, 0);
          return msg;
        });
      }
    };
  }

};
