import fs from 'fs';

const path = 'src/pages/admin/AdminCompetitorDetailPage.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  `  const fetchData = async () => {
    try {
      const res = await fetch(\`/api/admin/seo/competitors/\${id}/data\`, {
        headers: { 'csrf-token': csrfToken }
      });
      const json = await res.json();
      setData(json);
      setIsLoading(false);
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };`,
  `  const fetchData = async () => {
    try {
      const res = await fetch(\`/api/admin/seo/competitors/\${id}/data\`, {
        headers: { 'csrf-token': csrfToken }
      });
      const text = await res.text();
      if (!res.ok || text.trim().toLowerCase().startsWith('<!doctype') || text.trim().startsWith('<html') || text.trim().startsWith('<')) {
        // Fallback for static hosting
        const stored = localStorage.getItem('ilovepdf_seo_competitors');
        const comps = stored ? JSON.parse(stored) : [];
        const comp = comps.find((c: any) => c.id === id);
        if (comp) {
          setData({ competitor: comp, scanHistory: [], metrics: null });
        }
        setIsLoading(false);
        return;
      }
      setData(JSON.parse(text));
      setIsLoading(false);
    } catch (e) {
      console.error(e);
      const stored = localStorage.getItem('ilovepdf_seo_competitors');
      const comps = stored ? JSON.parse(stored) : [];
      const comp = comps.find((c: any) => c.id === id);
      if (comp) {
        setData({ competitor: comp, scanHistory: [], metrics: null });
      }
      setIsLoading(false);
    }
  };`
);

code = code.replace(
  `  const handleScan = async (scanType: string) => {
    setIsScanning(true);
    try {
      const res = await fetch(\`/api/admin/seo/competitors/\${id}/scan\`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'csrf-token': csrfToken 
        },
        body: JSON.stringify({ type: scanType })
      });
      
      if (res.ok) {
        await fetchData();
      } else {
        alert('Scan failed.');
      }
    } catch (e) {
      console.error(e);
      alert('Network error during scan.');
    } finally {
      setIsScanning(false);
    }
  };`,
  `  const handleScan = async (scanType: string) => {
    setIsScanning(true);
    try {
      const res = await fetch(\`/api/admin/seo/competitors/\${id}/scan\`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'csrf-token': csrfToken 
        },
        body: JSON.stringify({ type: scanType })
      });
      
      const text = await res.text();
      if (!res.ok || text.trim().toLowerCase().startsWith('<!doctype') || text.trim().startsWith('<html') || text.trim().startsWith('<')) {
        // Fallback: Mock a scan success for static hosting
        setTimeout(() => {
          alert('Scan simulated in static mode. Deploy the Node.js backend to enable the 2000IQ web crawler!');
          const stored = localStorage.getItem('ilovepdf_seo_competitors');
          let comps = stored ? JSON.parse(stored) : [];
          let compIndex = comps.findIndex((c: any) => c.id === id);
          if (compIndex > -1) {
            comps[compIndex].lastScan = new Date().toISOString();
            localStorage.setItem('ilovepdf_seo_competitors', JSON.stringify(comps));
          }
          fetchData();
          setIsScanning(false);
        }, 1500);
        return;
      }
      
      await fetchData();
    } catch (e) {
      console.error(e);
      alert('Network error during scan.');
    } finally {
      setIsScanning(false);
    }
  };`
);

fs.writeFileSync(path, code);
console.log('Patched AdminCompetitorDetailPage.tsx');
