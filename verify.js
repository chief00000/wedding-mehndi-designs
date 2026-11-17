/* Lightweight project checks. Run with: node verify.js */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = __dirname;
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const fail = message => { console.error(`FAIL: ${message}`); process.exitCode = 1; };
const pass = message => console.log(`PASS: ${message}`);

for (const file of ['data.js', 'script.js']) {
  try { new vm.Script(read(file), { filename: file }); pass(`${file} parses`); }
  catch (error) { fail(`${file} syntax: ${error.message}`); }
}

try {
  const context = vm.createContext({});
  const source = `${read('data.js')}\n;JSON.stringify(CATEGORY_DATA.map(category => ({name:category.name,count:category.designs.length,designs:category.designs})))`;
  const categories = JSON.parse(vm.runInContext(source, context));
  const designs = categories.flatMap(category => category.designs);
  const ids = designs.map(design => design.id);
  if (categories.length !== 30) fail(`expected 30 categories; found ${categories.length}`);
  else pass('30 catalogue categories found');
  if (categories.some(category => category.count !== 250)) fail('each category must contain exactly 250 concepts');
  else pass('250 concepts in every category');
  if (designs.length !== 7500) fail(`expected 7,500 concepts; found ${designs.length}`);
  else pass('7,500 concepts total');
  if (new Set(ids).size !== ids.length) fail('catalogue IDs are not unique');
  else pass('catalogue IDs are unique');
  if (designs.some(d => !d.id || !d.name || !d.description || !d.prompt || !d.subcategory || !d.palette?.bg || !d.palette?.ink || !d.palette?.line)) fail('one or more catalogue records have missing required fields');
  else pass('catalogue records contain required fields');
} catch (error) { fail(`catalogue validation: ${error.message}`); }

try {
  const html = read('index.html');
  const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map(match => match[1]);
  if (new Set(ids).size !== ids.length) fail('HTML contains duplicate IDs');
  else pass('HTML IDs are unique');
  for (const asset of ['style.css', 'data.js', 'script.js']) {
    if (!fs.existsSync(path.join(root, asset))) fail(`missing required asset: ${asset}`);
    else pass(`${asset} exists`);
  }
  if (/\<script\b[^>]*\bsrc=["']https?:\/\//i.test(html)) fail('remote script dependency found in index.html');
  else pass('no remote script dependencies in index.html');
} catch (error) { fail(`HTML checks: ${error.message}`); }

try {
  const script = read('script.js');
  const start = script.indexOf('const tools = ');
  const end = script.indexOf(';', start);
  if (start < 0 || end < 0) throw new Error('tool registry not found');
  const tools = vm.runInNewContext(script.slice(start + 'const tools = '.length, end));
  if (tools.length !== 30) fail(`expected 30 tools; found ${tools.length}`);
  else pass('30 tools registered');
  if (new Set(tools.map(tool => tool[0])).size !== tools.length) fail('tool route IDs are not unique');
  else pass('tool route IDs are unique');
  const groups = [...new Set(tools.map(tool => tool[2]))];
  if (groups.length !== 3 || groups.some(group => tools.filter(tool => tool[2] === group).length !== 10)) fail('tool groups are not balanced 10/10/10');
  else pass('tool groups contain 10 tools each');
} catch (error) { fail(`tool registry validation: ${error.message}`); }

if (process.exitCode) console.error('\nSome checks failed. Review the messages above.');
else console.log('\nAll automated project checks passed. This does not replace browser or live-deployment testing.');
