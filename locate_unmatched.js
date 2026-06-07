const fs = require('fs');
const s = fs.readFileSync('app.js','utf8');
let stack = [];
const pairs = { '{': '}', '(': ')', '[': ']' };
let backtickOpen = false, singleOpen = false, doubleOpen = false;
for (let i = 0; i < s.length; i++) {
  const ch = s[i];
  if (ch === '`' && !singleOpen && !doubleOpen) { backtickOpen = !backtickOpen; }
  else if (ch === "'" && !doubleOpen && !backtickOpen) { singleOpen = !singleOpen; }
  else if (ch === '"' && !singleOpen && !backtickOpen) { doubleOpen = !doubleOpen; }
  if (backtickOpen || singleOpen || doubleOpen) continue;
  if (ch === '{' || ch === '(' || ch === '[') stack.push({ch, i});
  if (ch === '}' || ch === ')' || ch === ']') {
    const last = stack.pop();
    if (!last) {
      const before = s.slice(Math.max(0, i-100), i+100);
      const line = s.slice(0,i).split('\n').length;
      console.log('Unmatched closing', ch, 'at index', i, 'line', line);
      console.log('\n--- context ---\n', before);
      process.exit(0);
    }
    const expected = pairs[last.ch];
    if (expected !== ch) {
      const line = s.slice(0,i).split('\n').length;
      console.log('Mismatched', last.ch, 'opened at', last.i, 'but closed with', ch, 'at', i, 'line', line);
      process.exit(0);
    }
  }
}
console.log('No unmatched closings found. Remaining stack length', stack.length);
if (stack.length) {
  const first = stack[0];
  const line = s.slice(0,first.i).split('\n').length;
  console.log('First unclosed', first.ch, 'at index', first.i, 'line', line);
}
