import fs from 'fs';

let content = fs.readFileSync('src/layouts/AdminLayout.tsx', 'utf8');

const searchString = "<span className=\"font-semibold\">Navigation & Footer</span>\\n          </NavLink>";
const newLink = `<span className="font-semibold">Navigation & Footer</span>
          </NavLink>
          
          <NavLink 
            to="/admin/languages" 
            end
            className={({ isActive }) => \`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all \${isActive ? 'bg-[#272830] text-white shadow-sm' : 'text-[#686B74] hover:bg-[#F8F9FA] hover:text-[#272830]'}\`}
          >
            <Globe className="w-4 h-4" />
            <span className="font-semibold">Languages & SEO</span>
          </NavLink>`;

content = content.replace(searchString, newLink);

if (!content.includes('Globe')) {
  content = content.replace("Settings, ExternalLink, Menu, X, Share2, ", "Settings, ExternalLink, Menu, X, Share2, Globe, ");
}

fs.writeFileSync('src/layouts/AdminLayout.tsx', content);
console.log('Patched AdminLayout.tsx to include Languages page');
