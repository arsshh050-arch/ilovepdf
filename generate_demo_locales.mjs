import fs from 'fs';
import path from 'path';

const localesDir = path.join(process.cwd(), 'public', 'locales');
if (!fs.existsSync(localesDir)) {
  fs.mkdirSync(localesDir, { recursive: true });
}

const en = {
  "home": {
    "hero": {
      "title": "Every PDF tool you need in one place",
      "subtitle": "Merge, split, compress, convert, edit, organize, sign and protect PDF documents online with fast and easy tools."
    }
  }
};

const es = {
  "home": {
    "hero": {
      "title": "Todas las herramientas PDF que necesitas en un solo lugar",
      "subtitle": "Une, divide, comprime, convierte, edita, organiza, firma y protege documentos PDF en línea con herramientas rápidas y fáciles."
    }
  }
};

const hi = {
  "home": {
    "hero": {
      "title": "हर पीडीएफ टूल जो आपको एक ही स्थान पर चाहिए",
      "subtitle": "तेज़ और आसान टूल के साथ ऑनलाइन पीडीएफ दस्तावेज़ों को मर्ज, स्प्लिट, कंप्रेस, कन्वर्ट, एडिट, व्यवस्थित, साइन और सुरक्षित करें।"
    }
  }
};

const ar = {
  "home": {
    "hero": {
      "title": "كل أداة PDF تحتاجها في مكان واحد",
      "subtitle": "قم بدمج وتقسيم وضغط وتحويل وتحرير وتنظيم وتوقيع وحماية مستندات PDF عبر الإنترنت بأدوات سريعة وسهلة."
    }
  }
};

[
  { lang: 'en', data: en },
  { lang: 'es', data: es },
  { lang: 'hi', data: hi },
  { lang: 'ar', data: ar }
].forEach(({ lang, data }) => {
  const langDir = path.join(localesDir, lang);
  if (!fs.existsSync(langDir)) {
    fs.mkdirSync(langDir, { recursive: true });
  }
  fs.writeFileSync(path.join(langDir, 'translation.json'), JSON.stringify(data, null, 2));
});

console.log('Demo locales generated.');
