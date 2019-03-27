const server = require("./server.js");

server.listen((port = 5000), function() {
  console.log(`\n  Listening on http://localhost:${port}\n`);
});
