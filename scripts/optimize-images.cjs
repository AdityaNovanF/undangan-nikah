const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const publicDir = path.join(__dirname, '../public');

const tasks = [
  // Foto mempelai — target: ~60KB
  {
    input: path.join(publicDir, 'mempelai pria.jpeg'),
    output: path.join(publicDir, 'mempelai-pria.webp'),
    options: { width: 600, height: 800, fit: 'cover', quality: 78 },
  },
  {
    input: path.join(publicDir, 'mempelai wanita.jpeg'),
    output: path.join(publicDir, 'mempelai-wanita.webp'),
    options: { width: 600, height: 800, fit: 'cover', quality: 78 },
  },
  // Bank logos — kecil saja, pakai PNG asli tapi resize kalau perlu
  // Galeri — target: ~100-150KB masing-masing
  {
    input: path.join(publicDir, 'galeri/galeri akdsj.jpeg'),
    output: path.join(publicDir, 'galeri/g1.webp'),
    options: { width: 600, height: 750, fit: 'cover', quality: 75 },
  },
  {
    input: path.join(publicDir, 'galeri/galeri fwie.jpeg'),
    output: path.join(publicDir, 'galeri/g2.webp'),
    options: { width: 600, height: 750, fit: 'cover', quality: 75 },
  },
  {
    input: path.join(publicDir, 'galeri/galeri iyegd.jpeg'),
    output: path.join(publicDir, 'galeri/g3.webp'),
    options: { width: 600, height: 750, fit: 'cover', quality: 75 },
  },
  {
    input: path.join(publicDir, 'galeri/galeri sdhkbf.jpeg'),
    output: path.join(publicDir, 'galeri/g4.webp'),
    options: { width: 600, height: 750, fit: 'cover', quality: 75 },
  },
  {
    input: path.join(publicDir, 'galeri/galeri udgj.jpeg'),
    output: path.join(publicDir, 'galeri/g5.webp'),
    options: { width: 600, height: 750, fit: 'cover', quality: 75 },
  },
  {
    input: path.join(publicDir, 'galeri/galeri uief.jpeg'),
    output: path.join(publicDir, 'galeri/g6.webp'),
    options: { width: 600, height: 750, fit: 'cover', quality: 75 },
  },
];

async function convert() {
  for (const task of tasks) {
    try {
      const before = fs.statSync(task.input).size;
      await sharp(task.input)
        .resize(task.options.width, task.options.height, { fit: task.options.fit })
        .webp({ quality: task.options.quality, effort: 4 })
        .toFile(task.output);
      const after = fs.statSync(task.output).size;
      const pct = Math.round((1 - after / before) * 100);
      console.log(`✓ ${path.basename(task.input)} → ${path.basename(task.output)} | ${(before/1024).toFixed(0)}KB → ${(after/1024).toFixed(0)}KB (-${pct}%)`);
    } catch (err) {
      console.error(`✗ ${task.input}: ${err.message}`);
    }
  }
  console.log('\nDone! All images converted to WebP.');
}

convert();
