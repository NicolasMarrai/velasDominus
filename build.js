// ============================================================
// Gera css/style.min.css e js/main.min.js a partir dos fontes.
// Rode `npm run build` sempre que editar css/style.css ou js/main.js
// antes de publicar em produção — o index.html carrega os .min.
// ============================================================
const fs = require('fs');
const path = require('path');
const csso = require('csso');
const { minify } = require('terser');

async function buildCss() {
  const srcPath = path.join(__dirname, 'css', 'style.css');
  const outPath = path.join(__dirname, 'css', 'style.min.css');
  const src = fs.readFileSync(srcPath, 'utf8');
  const { css } = csso.minify(src);
  fs.writeFileSync(outPath, css);
  console.log(
    `css/style.min.css gerado (${src.length} -> ${css.length} bytes)`
  );
}

async function buildJs() {
  const srcPath = path.join(__dirname, 'js', 'main.js');
  const outPath = path.join(__dirname, 'js', 'main.min.js');
  const src = fs.readFileSync(srcPath, 'utf8');
  const result = await minify(src, { compress: true, mangle: true });
  fs.writeFileSync(outPath, result.code);
  console.log(
    `js/main.min.js gerado (${src.length} -> ${result.code.length} bytes)`
  );
}

Promise.all([buildCss(), buildJs()]).catch((err) => {
  console.error(err);
  process.exit(1);
});
