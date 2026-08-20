import fs from 'fs';

let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

content = content.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport { useTranslation } from 'react-i18next';");

const fnStart = "export function Home() {";
content = content.replace(fnStart, fnStart + "\n  const { t } = useTranslation();");

content = content.replace(
  ">          Every PDF tool you need in one place        </h1>",
  ">          {t('home.hero.title', 'Every PDF tool you need in one place')}        </h1>"
);

content = content.replace(
  ">          Merge, split, compress, convert, edit, organize, sign and protect PDF documents online with fast and easy tools.        </p>",
  ">          {t('home.hero.subtitle', 'Merge, split, compress, convert, edit, organize, sign and protect PDF documents online with fast and easy tools.')}        </p>"
);

fs.writeFileSync('src/pages/Home.tsx', content);
console.log('Patched Home.tsx to use translations');
