const esbuild = require('esbuild');

const tests = {
  'text-node precomposed \u1ed1': 'export default () => <span>S\u1ed1 li\u1ec7u</span>;',
  'string precomposed \u1ed1': 'const x = "S\u1ed1"; export default () => <span>{x}</span>;',
  'text-node circumflex \u00f4': 'export default () => <span>S\u00f4 li\u1ec7u</span>;',
};

(async () => {
  for (const [name, code] of Object.entries(tests)) {
    try {
      await esbuild.transform(code, { loader: 'jsx' });
      console.log('OK   ', name);
    } catch (err) {
      console.log('FAIL ', name, '->', (err.errors && err.errors[0] && err.errors[0].text) || err.message);
    }
  }
})();
