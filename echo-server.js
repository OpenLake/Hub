const http = require('http');
const server = http.createServer((req, res) => {
  console.log('--- REQ HEADERS ---');
  console.log(req.headers);
  console.log('--- REQ URL ---');
  console.log(req.url);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ ok: true, headers: req.headers }));
});
server.listen(3006, () => {
  console.log('Echo server listening on 3006');
});
