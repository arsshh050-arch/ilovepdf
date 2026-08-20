const http = require('http');

const data = JSON.stringify({
  email: 'admin@ilovepdf.in',
  password: 'Admin@123456'
});

const req = http.request({
  hostname: '127.0.0.1',
  port: 3000,
  path: '/api/admin/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    console.log('Login Response:', body);
    const result = JSON.parse(body);
    if(result.token) {
      console.log('Got token:', result.token);
      // Now add competitor
      const compData = JSON.stringify({
        name: "Test",
        domain: "test.com",
        country: "Global",
        language: "en"
      });
      const req2 = http.request({
        hostname: '127.0.0.1',
        port: 3000,
        path: '/api/admin/seo/competitors',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + result.token,
          'Content-Length': compData.length
        }
      }, res2 => {
        let body2 = '';
        res2.on('data', d => body2 += d);
        res2.on('end', () => {
          console.log('Add Competitor Response:', res2.statusCode, body2);
        });
      });
      req2.write(compData);
      req2.end();
    }
  });
});
req.write(data);
req.end();
