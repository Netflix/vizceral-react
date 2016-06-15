#!/usr/bin/env node

'use strict';
const docGenMd = require('gulp-react-docs/src/react-docgen-md.js');
const fs = require('fs');
const path = require('path');

// Generate markdown
const pathToSrc = path.resolve(process.argv[2]);
const srcLink = path.relative(path.resolve('.'), pathToSrc);
if (!path) { process.exit(-1); }

const source = fs.readFileSync(pathToSrc, 'utf8');
const markdownString = docGenMd(source, { srcLink: srcLink, componentName: 'Vizceral' });

// Modify README.md
fs.writeFileSync('README.md', markdownString);
