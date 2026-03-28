const fs = require('fs');
const path = require('path');

const root = __dirname;
const dist = path.join(root, 'dist');

if (!fs.existsSync(dist)) {
  fs.mkdirSync(dist, { recursive: true });
}

['index.html', 'application.css', '.nojekyll'].forEach((name) => {
  const src = path.join(root, name);
  const dest = path.join(dist, name);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  }
});
