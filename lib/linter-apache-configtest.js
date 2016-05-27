'use babel';

import LinterApacheConfigtestView from './linter-apache-configtest-view';
import { CompositeDisposable } from 'atom';

export default {

  linterApacheConfigtestView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.linterApacheConfigtestView = new LinterApacheConfigtestView(state.linterApacheConfigtestViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.linterApacheConfigtestView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'linter-apache-configtest:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.linterApacheConfigtestView.destroy();
  },

  serialize() {
    return {
      linterApacheConfigtestViewState: this.linterApacheConfigtestView.serialize()
    };
  },

  toggle() {
    console.log('LinterApacheConfigtest was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
