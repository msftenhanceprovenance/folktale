//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Licensed under MIT. See LICENCE for full licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const mm = Symbol.for('@@meta:magical');
const env = require("folktale/helpers/env");

const copyDocumentation = (source, target, extensions = {}) => {
  const docs = env("FOLKTALE_DOCS", "false");
  if (docs !== 'false') {
    target[mm] = Object.assign({}, source[mm] || {}, extensions);
  }
};

module.exports = copyDocumentation;
