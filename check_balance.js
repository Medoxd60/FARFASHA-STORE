const fs = require('fs');
const path = 'app.js';
const s = fs.readFileSync(path, 'utf8');
let stack = [];
const pairs = { '{': '}', '(': ')', '[': ']' };
let backtickOpen = false;
let singleOpen = false;
let doubleOpen = false;
for (let i = 0; i < s.length; i++) {
  const ch = s[i];
  if (ch === '`' && !singleOpen && !doubleOpen) { backtickOpen = !backtickOpen; }
  else if (ch === "'" && !doubleOpen && !backtickOpen) { singleOpen = !singleOpen; }
  else if (ch === '"' && !singleOpen && !backtickOpen) { doubleOpen = !doubleOpen; }
  if (backtickOpen || singleOpen || doubleOpen) continue;
  if (ch === '{' || ch === '(' || ch === '[') stack.push({ch, i});
  if (ch === '}' || ch === ')' || ch === ']') {
    const last = stack.pop();
    if (!last) { console.log('Unmatched closing', ch, 'at', i); break; }
    const expected = pairs[last.ch];
    if (expected !== ch) { console.log('Mismatched', last.ch, 'opened at', last.i, 'but closed with', ch, 'at', i); break; }
  }
}
console.log('stack len', stack.length, 'backtickOpen', backtickOpen, 'singleOpen', singleOpen, 'doubleOpen', doubleOpen);
if (stack.length) console.log('first unclosed at', stack[0]);

// dump tail for inspection
console.log('\n--- tail (last 400 chars) ---\n');
console.log(s.slice(-400));
