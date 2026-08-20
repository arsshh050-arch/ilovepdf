import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

// Remove everything from line 300 to 411, since PublicRoutes() now handles it all.
// Looking for "<Route path=\"/login\" element={<Login />} />" down to the end of the Routes block.

const startStr = '          <Route path="/login" element={<Login />} />';
const endStr = '              </Routes>';

const startIdx = content.indexOf(startStr);
const endIdx = content.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
  content = content.substring(0, startIdx) + content.substring(endIdx);
  fs.writeFileSync('src/App.tsx', content);
  console.log('Removed duplicate static routes at the end of App.tsx');
} else {
  console.log('Could not find duplicate routes block');
}
