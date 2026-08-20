async function run() {
  const loginRes = await fetch('http://127.0.0.1:3000/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@ilovepdf.in', password: 'Admin@123456' })
  });
  const loginData = await loginRes.json();
  console.log('Login:', loginData);
  
  if (loginData.token) {
    const compRes = await fetch('http://127.0.0.1:3000/api/admin/seo/competitors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginData.token}`
      },
      body: JSON.stringify({ name: "Test", domain: "test.com", country: "Global", language: "en" })
    });
    console.log('Status:', compRes.status);
    console.log('Body:', await compRes.text());
  }
}
run();
