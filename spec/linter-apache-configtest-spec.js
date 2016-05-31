'use babel';

import * as path from 'path';
import * as fs from 'fs';
import ConfigTestParser from '../lib/parser';

function readFileAsync(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

describe('ConfigTestParser', () => {
  const errorFile = path.join(__dirname, 'fixtures', 'errors.txt');
  const successFile = path.join(__dirname, 'fixtures', 'success.txt');

  describe('when the configtest executable fails', () => {
    let results;

    beforeEach(() => {
      waitsForPromise(() => {
        return readFileAsync(errorFile)
          .then((errorText) => {
            results = ConfigTestParser.parse(true, errorText);
          });
      });
    });

    it('returns a linter error for each line', () => {
      expect(results.length).toBe(2);
      results.forEach((res) => {
        expect(res.type).toBe('Error');
      });
    });

    it('correctly parses the file name from the error message', () => {
      expect(results[0].filePath).toBe('/tmp/example.conf');
    });

    it('correctly parses the line number from the error message', () => {
      expect(results[0].range).toBe(3);
    });

    it('correctly parses single line error descriptions', () => {
      expect(results[0].text).toBe('LoadModule takes two arguments, a module name and the name of a shared object file to load it from');
    });

    it('correctly parses dual line error descriptions', () => {
      expect(results[1].text).toBe("Invalid command 'Alias', perhaps misspelled or defined by a module not included in the server configuration");
    });
  });

  describe('when the configtest executable succeeds', () => {
    let results;

    beforeEach(() => {
      waitsForPromise(() => {
        return readFileAsync(successFile)
          .then((successText) => {
            results = ConfigTestParser.parse(false, successText);
          });
      });
    });

    it('ignores the "Syntax OK" marker', () => {
      expect(results.length).toBe(1);
    });

    it('correctly parses each line into an informational message', () => {
      expect(results[0].type).toBe('Info');
      expect(results[0].text).toBe("AH00558: httpd: Could not reliably determine the server's fully qualified domain name, using 127.0.1.1. Set the 'ServerName' directive globally to suppress this message");
    });
  });

});
