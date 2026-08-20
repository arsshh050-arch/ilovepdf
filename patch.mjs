import fs from 'fs';

const path = 'src/pages/admin/AdminCompetitorsPage.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  `  const fetchCompetitors = async () => {
    try {
      const res = await fetch('/api/admin/seo/competitors', {
        headers: { 'csrf-token': csrfToken }
      });
      const data = await res.json();
      setCompetitors(Array.isArray(data) ? data : []);
      setIsLoading(false);
    } catch (e) {
      console.error('Failed to fetch competitors', e);
      setCompetitors([]);
      setIsLoading(false);
    }
  };`,
  `  const fetchCompetitors = async () => {
    try {
      const res = await fetch('/api/admin/seo/competitors', {
        headers: { 'csrf-token': csrfToken }
      });
      const text = await res.text();
      if (text.trim().toLowerCase().startsWith('<!doctype') || text.trim().startsWith('<html') || text.trim().startsWith('<')) {
        // Fallback for static hosting
        const stored = localStorage.getItem('ilovepdf_seo_competitors');
        setCompetitors(stored ? JSON.parse(stored) : []);
        setIsLoading(false);
        return;
      }
      const data = JSON.parse(text);
      setCompetitors(Array.isArray(data) ? data : []);
      setIsLoading(false);
    } catch (e) {
      console.error('Failed to fetch competitors, using fallback', e);
      const stored = localStorage.getItem('ilovepdf_seo_competitors');
      setCompetitors(stored ? JSON.parse(stored) : []);
      setIsLoading(false);
    }
  };`
);

code = code.replace(
  `      if (res.ok) {
        setIsAdding(false);
        setNewComp({ name: '', domain: '', country: 'Global', language: 'en', notes: '' });
        fetchCompetitors();
      } else {
        const errText = await res.text();
        alert(\`Failed to add competitor: \${errText}\`);
      }`,
  `      const text = await res.text();
      if (!res.ok || text.trim().toLowerCase().startsWith('<!doctype') || text.trim().startsWith('<html') || text.trim().startsWith('<')) {
        // Fallback for static hosting or server error
        const newCompetitor = {
          id: \`comp-\${Date.now()}\`,
          name: newComp.name,
          domain: newComp.domain.replace(/^https?:\\/\\//, '').replace(/\\/$/, ''),
          country: newComp.country || 'Global',
          language: newComp.language || 'en',
          notes: newComp.notes || '',
          status: 'active',
          lastScan: null,
          createdAt: new Date().toISOString()
        };
        const stored = localStorage.getItem('ilovepdf_seo_competitors');
        const comps = stored ? JSON.parse(stored) : [];
        comps.push(newCompetitor);
        localStorage.setItem('ilovepdf_seo_competitors', JSON.stringify(comps));
        
        setIsAdding(false);
        setNewComp({ name: '', domain: '', country: 'Global', language: 'en', notes: '' });
        fetchCompetitors();
        return;
      }

      // Success from Node backend
      setIsAdding(false);
      setNewComp({ name: '', domain: '', country: 'Global', language: 'en', notes: '' });
      fetchCompetitors();`
);

code = code.replace(
  `  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this competitor?')) return;
    try {
      await fetch(\`/api/admin/seo/competitors/\${id}\`, {
        method: 'DELETE',
        headers: { 'csrf-token': csrfToken }
      });
      fetchCompetitors();
    } catch (e) {
      console.error('Delete failed', e);
    }
  };`,
  `  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this competitor?')) return;
    try {
      const res = await fetch(\`/api/admin/seo/competitors/\${id}\`, {
        method: 'DELETE',
        headers: { 'csrf-token': csrfToken }
      });
      const text = await res.text();
      if (!res.ok || text.trim().toLowerCase().startsWith('<!doctype') || text.trim().startsWith('<html') || text.trim().startsWith('<')) {
        // Fallback for static hosting
        const stored = localStorage.getItem('ilovepdf_seo_competitors');
        let comps = stored ? JSON.parse(stored) : [];
        comps = comps.filter((c: any) => c.id !== id);
        localStorage.setItem('ilovepdf_seo_competitors', JSON.stringify(comps));
        fetchCompetitors();
        return;
      }
      fetchCompetitors();
    } catch (e) {
      console.error('Delete failed', e);
      // Fallback
      const stored = localStorage.getItem('ilovepdf_seo_competitors');
      let comps = stored ? JSON.parse(stored) : [];
      comps = comps.filter((c: any) => c.id !== id);
      localStorage.setItem('ilovepdf_seo_competitors', JSON.stringify(comps));
      fetchCompetitors();
    }
  };`
);

fs.writeFileSync(path, code);
console.log('Patched AdminCompetitorsPage.tsx');
