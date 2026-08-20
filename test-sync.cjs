const http = require('http');

const req = http.request('http://localhost:3000/api/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    if (!json.token) {
      console.log('Login failed', json);
      return;
    }
    const token = json.token;
    console.log('Got token', token);
    
    const syncReq = http.request('http://localhost:3000/api/admin/blogs/sync', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }, (syncRes) => {
      let syncData = '';
      syncRes.on('data', chunk => syncData += chunk);
      syncRes.on('end', () => {
        console.log('Sync status:', syncRes.statusCode);
        console.log('Sync data:', syncData);
      });
    });
    syncReq.end();
  });
});

req.write(JSON.stringify({ email: 'admin@ilovepdf.in', password: 'Admin@123456' })); 
req.end();
