import http from 'http';
import fs from 'fs';
import path from 'path';

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/index.html';
  const filePath = path.join(process.cwd(), reqPath);

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end(`File not found: ${reqPath}`);
    } else {
      const ext = path.extname(filePath);
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
      res.end(content);
    }
  });
});

server.listen(8088, async () => {
  console.log('Verifying static serving and file integrity...');
  const filesToTest = [
    '/',
    '/style.css',
    '/app.js',
    '/shared/math.js',
    '/shared/vectors.js',
    '/shared/constants.js',
    '/shared/geometry.js',
    '/models/lateralRaise/data.js',
    '/models/lateralRaise/anatomy.js',
    '/models/lateralRaise/biomechanics.js',
    '/models/lateralRaise/renderer.js',
    '/models/lateralRaise/model.js',
    '/models/bicepsCurl/data.js',
    '/models/bicepsCurl/anatomy.js',
    '/models/bicepsCurl/biomechanics.js',
    '/models/bicepsCurl/renderer.js',
    '/models/bicepsCurl/model.js',
    '/models/squat/data.js',
    '/models/squat/anatomy.js',
    '/models/squat/biomechanics.js',
    '/models/squat/renderer.js',
    '/models/squat/model.js',
    '/models/benchPress/data.js',
    '/models/benchPress/anatomy.js',
    '/models/benchPress/biomechanics.js',
    '/models/benchPress/renderer.js',
    '/models/benchPress/model.js',
    '/tests/test-runner.html',
    '/tests/unit-tests.js'
  ];

  let errors = 0;
  for (const f of filesToTest) {
    try {
      const res = await fetch(`http://localhost:8088${f}`);
      if (res.status !== 200) {
        console.error(`❌ HTTP ${res.status} for ${f}`);
        errors++;
      } else {
        console.log(`✅ HTTP 200 OK: ${f}`);
      }
    } catch (e) {
      console.error(`❌ Fetch failed for ${f}: ${e.message}`);
      errors++;
    }
  }

  server.close(() => {
    if (errors === 0) {
      console.log('\n🎉 ALL 14 ASSETS SERVED WITH 200 OK!');
      process.exit(0);
    } else {
      console.error(`\n❌ Failed with ${errors} errors.`);
      process.exit(1);
    }
  });
});
