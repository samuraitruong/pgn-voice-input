const fs = require('fs');
const path = require('path');

try {
  const stockfishSrcDir = path.join(__dirname, 'node_modules', 'stockfish', 'src');
  const publicDir = path.join(__dirname, 'public', "sf");

  if (!fs.existsSync(stockfishSrcDir)) {
    console.error(`Stockfish source directory not found: ${stockfishSrcDir}`);
    process.exit(1);
  }

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const files = fs.readdirSync(stockfishSrcDir);

  const filesToCopy = files.filter(file => 
    (file.startsWith('stockfish-') && (file.endsWith('.js') || file.endsWith('.wasm'))) || file.endsWith('.nnue')
  );

  if (filesToCopy.length === 0) {
    console.warn('No Stockfish files found to copy.');
    return;
  }

  filesToCopy.forEach(file => {
    const source = path.join(stockfishSrcDir, file);
    const dest = path.join(publicDir, file);
    fs.copyFileSync(source, dest);
    console.log(`Copied ${file} to public directory.`);
  });

} catch (error) {
  console.error('Error copying Stockfish files:', error);
  process.exit(1);
} 