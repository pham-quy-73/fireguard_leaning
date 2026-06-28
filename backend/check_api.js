const http = require('http');

http.get('http://localhost:5000/api/videos', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log("Status Code:", res.statusCode);
    console.log("Response:", data);
  });
}).on('error', (err) => {
  console.error("Error connecting to localhost:5000 ->", err.message);
});
