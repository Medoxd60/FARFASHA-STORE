const fs = require('fs');
const s = fs.readFileSync('app.js','utf8');
let count = 0;
let line = 1;
for (let i=0;i<s.length;i++){
  const ch=s[i];
  if (ch==='\n') line++;
  if (ch==='`'){
    // skip template literal content
    i++;
    while(i<s.length && s[i]!=="`"){
      if(s[i]==='\\') i++; // skip escaped
      i++;
    }
    continue;
  }
  if (ch==="'" || ch==='"'){
    const quote=ch; i++; while(i<s.length && s[i]!==quote){ if(s[i]==='\\') i++; i++; } continue;
  }
  if (ch==='{') count++;
  if (ch==='}') count--;
  if (count<0){
    console.log('Negative brace count at index', i, 'line', line);
    console.log('context:', s.slice(Math.max(0,i-80), i+80));
    process.exit(0);
  }
}
console.log('Final brace count', count);
