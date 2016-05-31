'use babel';

export default class ConfigTestParser {
  /**
   * Parses the stderr returned from the configtest and returns an array of
   * Linter messages. The 'range' property of each message is a simple line
   * number and must be converted to a proper range by the caller.
   */
  static parse(failed, errText) {
    const messages = [];

    if (failed) {
      // Push an error message for every entry (there will probably only be one)
      const matchExp = /error on line (\d+) of ([^:]+):( |\n)(.+)/g;
      var match;

      while ((match = matchExp.exec(errText)) !== null) {
        messages.push({
          type: 'Error',
          text: match[4],
          range: parseInt(match[1]),
          filePath: match[2]
        });
      }

      if (messages.length == 0) {
        atom.notifications.addWarning("This file failed its configtest, " +
          "but the linter couldn't understand apachectl's output. " +
          "Consider reporting an issue.", {
            detail: "configtest output:\n" + errText,
            dismissable: true
          });
      }
    } else {
      // Syntax checks out. Push a project-level info message for each line
      // in the resulting stderr.
      errText.split(/\n/).forEach((line) => {
        // Ignore the "Syntax OK" marker and any blank lines.
        if (line.match(/^Syntax OK/) || line.match(/^\s*$/)) { return; }

        messages.push({
          type: 'Info',
          text: line
        });
      });
    }

    return messages;
  }
}
