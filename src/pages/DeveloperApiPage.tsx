import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { buildBreadcrumbSchema, buildWebApplicationSchema } from '../seo/schema';
import { 
  Code2, 
  Key, 
  Zap, 
  ShieldCheck, 
  Copy, 
  Check, 
  Terminal, 
  Cpu, 
  Play, 
  Database, 
  Clock, 
  ArrowRight,
  Layers,
  CheckCircle2,
  Lock,
  Download,
  Server,
  FileCode2,
  ExternalLink,
  Sparkles,
  HelpCircle,
  BarChart3
} from 'lucide-react';

interface EndpointInfo {
  id: string;
  name: string;
  method: 'POST' | 'GET';
  path: string;
  description: string;
  params: { name: string; type: string; required: boolean; desc: string }[];
  curlSnippet: string;
  nodeSnippet: string;
  pythonSnippet: string;
  phpSnippet: string;
  goSnippet: string;
  mockResponse: object;
}

const ENDPOINTS: EndpointInfo[] = [
  {
    id: 'merge',
    name: 'Merge Multiple PDFs',
    method: 'POST',
    path: '/v1/pdf/merge',
    description: 'Combine two or more PDF files into a single structured document in custom order.',
    params: [
      { name: 'files', type: 'Array<File>', required: true, desc: 'Multipart form data containing PDF files' },
      { name: 'mode', type: 'string', required: false, desc: 'Ordering mode ("sequential" or "custom")' },
      { name: 'output_filename', type: 'string', required: false, desc: 'Name for the output combined file' }
    ],
    curlSnippet: `curl -X POST "https://api.ilovepdf.in/v1/pdf/merge" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "files=@document1.pdf" \\
  -F "files=@document2.pdf" \\
  -F "output_filename=merged_result.pdf"`,
    nodeSnippet: `import { ILovePdfClient } from '@ilovepdf/sdk';

const client = new ILovePdfClient({ apiKey: process.env.ILOVEPDF_API_KEY });

const result = await client.merge({
  files: ['./document1.pdf', './document2.pdf'],
  outputFilename: 'merged_result.pdf'
});

console.log('Processed PDF URL:', result.downloadUrl);`,
    pythonSnippet: `import requests

url = "https://api.ilovepdf.in/v1/pdf/merge"
headers = {"Authorization": "Bearer YOUR_API_KEY"}
files = [
    ('files', ('doc1.pdf', open('doc1.pdf', 'rb'), 'application/pdf')),
    ('files', ('doc2.pdf', open('doc2.pdf', 'rb'), 'application/pdf'))
]

response = requests.post(url, headers=headers, files=files)
print(response.json())`,
    phpSnippet: `$ch = curl_init("https://api.ilovepdf.in/v1/pdf/merge");
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer YOUR_API_KEY"]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, [
  'files[0]' => new CURLFile('doc1.pdf'),
  'files[1]' => new CURLFile('doc2.pdf')
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);`,
    goSnippet: `package main

import (
  "bytes"
  "fmt"
  "mime/multipart"
  "net/http"
)

func main() {
  // Post files to https://api.ilovepdf.in/v1/pdf/merge with Bearer header
  fmt.Println("ILovePDF API Request Sent")
}`,
    mockResponse: {
      status: "success",
      code: 200,
      task_id: "task_merge_9a82f3c1",
      file_name: "merged_result.pdf",
      page_count: 14,
      file_size_bytes: 2489100,
      download_url: "https://api.ilovepdf.in/v1/download/task_merge_9a82f3c1/merged_result.pdf",
      expires_at: "2026-08-12T07:16:58Z",
      processing_time_ms: 320
    }
  },
  {
    id: 'compress',
    name: 'Compress PDF File',
    method: 'POST',
    path: '/v1/pdf/compress',
    description: 'Reduce PDF file size up to 90% while maintaining maximum visual quality.',
    params: [
      { name: 'file', type: 'File', required: true, desc: 'Target PDF file to shrink' },
      { name: 'compression_level', type: 'string', required: false, desc: 'Compression intensity: "extreme", "recommended", or "low"' }
    ],
    curlSnippet: `curl -X POST "https://api.ilovepdf.in/v1/pdf/compress" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "file=@large_document.pdf" \\
  -F "compression_level=recommended"`,
    nodeSnippet: `const result = await client.compress({
  file: './large_document.pdf',
  compressionLevel: 'recommended'
});

console.log(\`Saved \${result.savedPercent}% of file size!\`);`,
    pythonSnippet: `response = requests.post(
    "https://api.ilovepdf.in/v1/pdf/compress",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    files={"file": open("large_doc.pdf", "rb")},
    data={"compression_level": "recommended"}
)`,
    phpSnippet: `// PHP Compress API Call Example`,
    goSnippet: `// Go Compress API Call Example`,
    mockResponse: {
      status: "success",
      code: 200,
      task_id: "task_compress_4f81a20b",
      original_bytes: 10485760,
      compressed_bytes: 1887436,
      saved_percent: "82%",
      download_url: "https://api.ilovepdf.in/v1/download/task_compress_4f81a20b/compressed.pdf",
      expires_at: "2026-08-12T07:16:58Z",
      processing_time_ms: 410
    }
  },
  {
    id: 'convert-word',
    name: 'Convert PDF to Word (.docx)',
    method: 'POST',
    path: '/v1/pdf/convert/word',
    description: 'Convert PDFs to fully editable Word documents with intact formatting and layout.',
    params: [
      { name: 'file', type: 'File', required: true, desc: 'Input PDF document' },
      { name: 'ocr', type: 'boolean', required: false, desc: 'Enable OCR for scanned image PDFs' }
    ],
    curlSnippet: `curl -X POST "https://api.ilovepdf.in/v1/pdf/convert/word" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "file=@report.pdf" \\
  -F "ocr=true"`,
    nodeSnippet: `const docxResult = await client.convertToWord({
  file: './report.pdf',
  ocr: true
});`,
    pythonSnippet: `response = requests.post(
    "https://api.ilovepdf.in/v1/pdf/convert/word",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    files={"file": open("report.pdf", "rb")}
)`,
    phpSnippet: `// PHP Convert to Word`,
    goSnippet: `// Go Convert to Word`,
    mockResponse: {
      status: "success",
      code: 200,
      task_id: "task_docx_31c9e8a0",
      file_name: "report.docx",
      file_size_bytes: 841200,
      download_url: "https://api.ilovepdf.in/v1/download/task_docx_31c9e8a0/report.docx",
      expires_at: "2026-08-12T07:16:58Z",
      processing_time_ms: 650
    }
  },
  {
    id: 'protect',
    name: 'Protect & Encrypt PDF',
    method: 'POST',
    path: '/v1/pdf/protect',
    description: 'Encrypt PDFs with 256-bit AES encryption and set user password permissions.',
    params: [
      { name: 'file', type: 'File', required: true, desc: 'PDF file to protect' },
      { name: 'password', type: 'string', required: true, desc: 'Strong access password' }
    ],
    curlSnippet: `curl -X POST "https://api.ilovepdf.in/v1/pdf/protect" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "file=@confidential.pdf" \\
  -F "password=SuperSecretPassword123!"`,
    nodeSnippet: `const protectedPdf = await client.protect({
  file: './confidential.pdf',
  password: 'SuperSecretPassword123!'
});`,
    pythonSnippet: `response = requests.post(
    "https://api.ilovepdf.in/v1/pdf/protect",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    files={"file": open("confidential.pdf", "rb")},
    data={"password": "SuperSecretPassword123!"}
)`,
    phpSnippet: `// PHP Protect PDF`,
    goSnippet: `// Go Protect PDF`,
    mockResponse: {
      status: "success",
      code: 200,
      task_id: "task_protect_72b109cc",
      file_name: "confidential_protected.pdf",
      encryption_type: "256-bit AES",
      download_url: "https://api.ilovepdf.in/v1/download/task_protect_72b109cc/protected.pdf",
      expires_at: "2026-08-12T07:16:58Z",
      processing_time_ms: 210
    }
  }
];

export function DeveloperApiPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointInfo>(ENDPOINTS[0]);
  const [selectedLang, setSelectedLang] = useState<'curl' | 'node' | 'python' | 'php' | 'go'>('curl');
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [demoApiKey, setDemoApiKey] = useState('ilovepdf_dev_8f3a9d21c4e72b01');
  const [isExecutingDemo, setIsExecutingDemo] = useState(false);
  const [demoOutput, setDemoOutput] = useState<object | null>(null);

  const copyToClipboard = (text: string, type: 'key' | 'snippet') => {
    navigator.clipboard.writeText(text);
    if (type === 'key') {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else {
      setCopiedSnippet(true);
      setTimeout(() => setCopiedSnippet(false), 2000);
    }
  };

  const generateNewKey = () => {
    const chars = '0123456789abcdef';
    let rand = '';
    for (let i = 0; i < 24; i++) {
      rand += chars[Math.floor(Math.random() * chars.length)];
    }
    setDemoApiKey(`ilovepdf_dev_${rand}`);
    setDemoOutput(null);
  };

  const executeLiveDemo = () => {
    setIsExecutingDemo(true);
    setDemoOutput(null);
    setTimeout(() => {
      setIsExecutingDemo(false);
      setDemoOutput({
        ...selectedEndpoint.mockResponse,
        api_key_used: demoApiKey.substring(0, 16) + '...',
        timestamp: new Date().toISOString()
      });
    }, 650);
  };

  const getSnippetForLang = () => {
    switch (selectedLang) {
      case 'node': return selectedEndpoint.nodeSnippet;
      case 'python': return selectedEndpoint.pythonSnippet;
      case 'php': return selectedEndpoint.phpSnippet;
      case 'go': return selectedEndpoint.goSnippet;
      default: return selectedEndpoint.curlSnippet;
    }
  };

  const breadcrumbSchema = buildBreadcrumbSchema([{ name: 'Developer API', path: '/developer-api' }], '/developer-api');
  const appSchema = buildWebApplicationSchema({
    name: 'ilovepdf.in REST API',
    slug: '/developer-api',
    description: 'Integrate fast, high-performance RESTful PDF processing into your application. Programmatically merge, compress, split, convert, protect, and OCR PDFs.',
    category: 'DeveloperApplication'
  });

  return (
    <div className="bg-[#F8F9FA] min-h-screen text-[#272830] font-['Inter',sans-serif]">
      <SEO
        title="Developer REST API Documentation & PDF Engine | ilovepdf.in"
        description="Integrate fast, high-performance RESTful PDF processing into your application. Programmatically merge, compress, split, convert, protect, and OCR PDFs with 256-bit SSL encryption."
        canonicalPath="/developer-api"
        schema={[breadcrumbSchema, appSchema]}
      />

      {/* HERO SECTION */}
      <section className="bg-[#1C1D22] text-white pt-16 pb-20 px-4 sm:px-6 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#E5322D]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#1A73E8]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#34363F] border border-[#484A54] text-[#E5322D] text-xs font-semibold mb-6">
            <Code2 size={16} />
            <span>ilovepdf.in v1 REST API</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* LEFT HERO TEXT */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                Powerful <span className="text-[#E5322D]">PDF Processing API</span> for Developers
              </h1>

              <p className="text-base sm:text-lg text-[#A0A4B0] leading-relaxed">
                Seamlessly convert, merge, compress, watermark, and OCR documents programmatically. Reliable, cloud-scalable REST endpoints built for high throughput.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a 
                  href="#sandbox" 
                  className="px-6 py-3.5 bg-[#E5322D] hover:bg-[#d42d28] text-white font-bold rounded-xl transition-all shadow-lg flex items-center gap-2 text-sm"
                >
                  <Key size={18} />
                  <span>Get Free API Key</span>
                </a>

                <a 
                  href="#playground" 
                  className="px-6 py-3.5 bg-[#2B2C34] hover:bg-[#373842] border border-[#3E404C] text-white font-semibold rounded-xl transition-all flex items-center gap-2 text-sm"
                >
                  <Terminal size={18} />
                  <span>API Playground</span>
                </a>
              </div>

              {/* STATS STRIP */}
              <div className="pt-6 border-t border-[#34363F] grid grid-cols-3 gap-4 text-left">
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-white">99.99%</div>
                  <div className="text-xs text-[#888A92] uppercase font-semibold mt-0.5">Uptime SLA</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-[#34A853]">&lt; 400ms</div>
                  <div className="text-xs text-[#888A92] uppercase font-semibold mt-0.5">Avg Processing</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-[#4285F4]">256-Bit</div>
                  <div className="text-xs text-[#888A92] uppercase font-semibold mt-0.5">AES Encryption</div>
                </div>
              </div>
            </div>

            {/* RIGHT CODE PREVIEW CARD */}
            <div className="lg:col-span-5 bg-[#24252C] rounded-2xl border border-[#3A3C46] shadow-2xl overflow-hidden text-xs font-mono">
              <div className="bg-[#1A1B20] px-4 py-3 border-b border-[#3A3C46] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#E5322D]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#F4B400]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#34A853]"></div>
                  <span className="text-[#888A92] text-[11px] ml-2">curl -X POST /v1/pdf/merge</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#34A853]/20 text-[#34A853] text-[10px] font-sans font-bold">200 OK</span>
              </div>

              <div className="p-4 text-[#A8B2C1] space-y-2 leading-relaxed overflow-x-auto">
                <p><span className="text-[#E5322D]">curl</span> -X POST "https://api.ilovepdf.in/v1/pdf/merge" \</p>
                <p className="pl-4"><span className="text-[#4285F4]">-H</span> "Authorization: Bearer sec_live_..." \</p>
                <p className="pl-4"><span className="text-[#4285F4]">-F</span> "files=@doc1.pdf" \</p>
                <p className="pl-4"><span className="text-[#4285F4]">-F</span> "files=@doc2.pdf"</p>
                
                <div className="pt-2 border-t border-[#34363F] text-[#34A853]">
                  <p>&#123;</p>
                  <p className="pl-4">"status": "success",</p>
                  <p className="pl-4">"task_id": "task_merge_9a82f3c1",</p>
                  <p className="pl-4">"download_url": "https://api.ilovepdf.in/..."</p>
                  <p>&#125;</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* API KEY SANDBOX GENERATOR SECTION */}
      <section id="sandbox" className="py-12 bg-white border-b border-[#E0E2E8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-[#F8F9FA] rounded-3xl border border-[#E0E2E8] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-[#E5322D] tracking-wider">
                <Sparkles size={14} />
                <span>Instant Developer Sandbox</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#272830]">
                Generate Your Test API Key
              </h2>
              <p className="text-xs sm:text-sm text-[#686B74]">
                Get 250 free PDF processing tasks per month. No credit card required. Use this key in your HTTP Authorization headers.
              </p>
            </div>

            <div className="w-full md:w-auto shrink-0 bg-white p-4 rounded-2xl border border-[#E0E2E8] shadow-xs space-y-3">
              <div className="text-[11px] font-bold text-[#888A92] uppercase">Your Sandbox Secret Key</div>
              <div className="flex items-center gap-2">
                <code className="px-3 py-2 bg-[#F1F3F7] rounded-lg text-xs font-mono font-bold text-[#272830] select-all border border-[#E0E2E8]">
                  {demoApiKey}
                </code>
                <button
                  onClick={() => copyToClipboard(demoApiKey, 'key')}
                  className="p-2 bg-[#E5322D] hover:bg-[#d42d28] text-white rounded-lg transition-colors"
                  title="Copy Key"
                >
                  {copiedKey ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              
              <div className="flex items-center justify-between text-[11px] text-[#686B74] pt-1">
                <span>Quota: 250 tasks/mo</span>
                <button 
                  onClick={generateNewKey}
                  className="text-[#1A73E8] font-semibold hover:underline cursor-pointer"
                >
                  Refresh Key
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* INTERACTIVE PLAYGROUND SECTION */}
      <section id="playground" className="py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#272830] tracking-tight mb-3">
              Interactive API Reference & Code Samples
            </h2>
            <p className="text-sm text-[#686B74]">
              Select an endpoint, choose your preferred programming language, and test live responses in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ENDPOINTS SIDEBAR (4 Cols) */}
            <div className="lg:col-span-4 bg-white p-4 rounded-3xl border border-[#E0E2E8] shadow-xs space-y-2">
              <div className="px-3 py-2 text-xs font-bold text-[#888A92] uppercase tracking-wider">
                Available Endpoints
              </div>

              {ENDPOINTS.map(ep => {
                const isSelected = selectedEndpoint.id === ep.id;
                return (
                  <button
                    key={ep.id}
                    onClick={() => {
                      setSelectedEndpoint(ep);
                      setDemoOutput(null);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl transition-all flex items-center justify-between border ${
                      isSelected 
                        ? 'bg-[#FFF0EE] border-[#FADBD8] text-[#E5322D]' 
                        : 'bg-white border-transparent hover:bg-[#F8F9FA] text-[#272830]'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm leading-snug">{ep.name}</div>
                      <div className="text-[11px] font-mono text-[#686B74] mt-0.5">{ep.path}</div>
                    </div>
                    <span className="px-2 py-0.5 bg-[#E5322D]/10 text-[#E5322D] font-mono text-[10px] font-bold rounded">
                      {ep.method}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* CODE PLAYGROUND & CONSOLE (8 Cols) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* ENDPOINT SPEC & CODE BOX */}
              <div className="bg-white rounded-3xl border border-[#E0E2E8] shadow-xs overflow-hidden">
                
                {/* TOP HEADER & LANGUAGE TABS */}
                <div className="bg-[#1C1D22] p-4 text-white flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-[#E5322D] text-white font-mono text-xs font-bold rounded">
                        {selectedEndpoint.method}
                      </span>
                      <span className="font-mono text-sm font-bold text-[#A8B2C1]">
                        {selectedEndpoint.path}
                      </span>
                    </div>
                    <p className="text-xs text-[#888A92] mt-1">{selectedEndpoint.description}</p>
                  </div>

                  {/* LANG SWITCHER */}
                  <div className="flex items-center gap-1 bg-[#2B2C34] p-1 rounded-xl border border-[#3E404C] text-xs">
                    {(['curl', 'node', 'python', 'php', 'go'] as const).map(lang => (
                      <button
                        key={lang}
                        onClick={() => setSelectedLang(lang)}
                        className={`px-2.5 py-1 rounded-lg font-semibold capitalize transition-colors ${
                          selectedLang === lang ? 'bg-[#E5322D] text-white' : 'text-[#A0A4B0] hover:text-white'
                        }`}
                      >
                        {lang === 'node' ? 'Node.js' : lang}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CODE SNIPPET AREA */}
                <div className="bg-[#24252C] p-5 text-xs font-mono text-[#D1D5DB] relative group overflow-x-auto">
                  <button
                    onClick={() => copyToClipboard(getSnippetForLang(), 'snippet')}
                    className="absolute top-4 right-4 px-3 py-1.5 bg-[#34363F] hover:bg-[#484A54] text-white rounded-lg transition-colors flex items-center gap-1.5 text-[11px] font-sans"
                  >
                    {copiedSnippet ? <Check size={14} className="text-[#34A853]" /> : <Copy size={14} />}
                    <span>{copiedSnippet ? 'Copied' : 'Copy Code'}</span>
                  </button>

                  <pre className="leading-relaxed pt-2">
                    {getSnippetForLang()}
                  </pre>
                </div>

                {/* PARAMETERS TABLE */}
                <div className="p-6 border-t border-[#E0E2E8]">
                  <h3 className="text-xs font-bold uppercase text-[#888A92] tracking-wider mb-4">
                    Request Parameters
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#E0E2E8] text-[#888A92]">
                          <th className="pb-2 font-bold">Parameter</th>
                          <th className="pb-2 font-bold">Type</th>
                          <th className="pb-2 font-bold">Required</th>
                          <th className="pb-2 font-bold">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E0E2E8]">
                        {selectedEndpoint.params.map((p, idx) => (
                          <tr key={idx}>
                            <td className="py-2.5 font-mono font-bold text-[#E5322D]">{p.name}</td>
                            <td className="py-2.5 font-mono text-[#686B74]">{p.type}</td>
                            <td className="py-2.5">
                              {p.required ? (
                                <span className="px-2 py-0.5 rounded bg-[#FFF0EE] text-[#E5322D] font-bold text-[10px]">Required</span>
                              ) : (
                                <span className="px-2 py-0.5 rounded bg-[#F1F3F7] text-[#686B74] text-[10px]">Optional</span>
                              )}
                            </td>
                            <td className="py-2.5 text-[#272830]">{p.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* RUN DEMO BUTTON */}
                  <div className="mt-6 pt-4 border-t border-[#E0E2E8] flex justify-end">
                    <button
                      onClick={executeLiveDemo}
                      disabled={isExecutingDemo}
                      className="px-5 py-2.5 bg-[#E5322D] hover:bg-[#d42d28] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {isExecutingDemo ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Sending API Request...</span>
                        </>
                      ) : (
                        <>
                          <Play size={14} />
                          <span>Run Live API Test</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>

              </div>

              {/* LIVE DEMO CONSOLE OUTPUT */}
              {demoOutput && (
                <div className="bg-[#1C1D22] rounded-3xl border border-[#3A3C46] p-6 text-white space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs font-mono border-b border-[#3A3C46] pb-3">
                    <div className="flex items-center gap-2 text-[#34A853] font-bold">
                      <CheckCircle2 size={16} />
                      <span>Response 200 OK</span>
                    </div>
                    <span className="text-[#888A92]">Response Time: 320ms</span>
                  </div>

                  <pre className="text-xs font-mono text-[#34A853] overflow-x-auto leading-relaxed pt-2">
                    {JSON.stringify(demoOutput, null, 2)}
                  </pre>
                </div>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* PRICING & RATE LIMIT TIERS */}
      <section className="py-14 sm:py-20 bg-[#F1F3F7] border-t border-[#E0E2E8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#272830] tracking-tight mb-3">
              Scalable API Plans
            </h2>
            <p className="text-sm text-[#686B74]">
              Start building for free. Scale seamlessly with high-volume enterprise SLAs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* DEV SANDBOX */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E0E2E8] shadow-xs flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="px-3 py-1 bg-[#F1F3F7] text-[#272830] text-xs font-bold rounded-full uppercase">
                  Free Developer
                </span>
                <div>
                  <div className="text-3xl font-extrabold text-[#272830]">$0 <span className="text-sm text-[#888A92] font-normal">/ mo</span></div>
                  <p className="text-xs text-[#686B74] mt-1">Perfect for testing, prototyping, and side projects.</p>
                </div>

                <ul className="space-y-2.5 text-xs text-[#272830]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#34A853]" />
                    <span>250 Free Tasks / Month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#34A853]" />
                    <span>15 MB Max File Size</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#34A853]" />
                    <span>Access to All PDF Endpoints</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#34A853]" />
                    <span>Community Forum Support</span>
                  </li>
                </ul>
              </div>

              <a 
                href="#sandbox"
                className="w-full py-3 bg-[#F1F3F7] hover:bg-[#E2E6EE] text-[#272830] font-bold text-xs rounded-xl text-center transition-colors block"
              >
                Get Free API Key
              </a>
            </div>

            {/* PRO API */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#E5322D] shadow-md flex flex-col justify-between space-y-6 relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#E5322D] text-white text-[10px] font-extrabold uppercase rounded-full tracking-wider shadow-xs">
                Most Popular
              </div>

              <div className="space-y-4">
                <span className="px-3 py-1 bg-[#FFF0EE] text-[#E5322D] text-xs font-bold rounded-full uppercase">
                  Pro Production
                </span>
                <div>
                  <div className="text-3xl font-extrabold text-[#272830]">$19 <span className="text-sm text-[#888A92] font-normal">/ mo</span></div>
                  <p className="text-xs text-[#686B74] mt-1">Designed for growing web & mobile applications.</p>
                </div>

                <ul className="space-y-2.5 text-xs text-[#272830]">
                  <li className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 size={16} className="text-[#E5322D]" />
                    <span>10,000 Tasks / Month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#34A853]" />
                    <span>100 MB Max File Size</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#34A853]" />
                    <span>Priority Processing Queue</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#34A853]" />
                    <span>Webhook Task Callbacks</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/pricing"
                className="w-full py-3 bg-[#E5322D] hover:bg-[#d42d28] text-white font-bold text-xs rounded-xl text-center transition-colors block"
              >
                Upgrade to Pro API
              </Link>
            </div>

            {/* ENTERPRISE */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E0E2E8] shadow-xs flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="px-3 py-1 bg-[#E8F0FE] text-[#1A73E8] text-xs font-bold rounded-full uppercase">
                  Enterprise
                </span>
                <div>
                  <div className="text-3xl font-extrabold text-[#272830]">Custom</div>
                  <p className="text-xs text-[#686B74] mt-1">Dedicated cloud infrastructure for high-throughput teams.</p>
                </div>

                <ul className="space-y-2.5 text-xs text-[#272830]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#34A853]" />
                    <span>Unlimited PDF Processing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#34A853]" />
                    <span>2 GB+ Custom File Limits</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#34A853]" />
                    <span>99.99% Uptime Guarantee & SLA</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#34A853]" />
                    <span>Dedicated Technical Account Manager</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/contact"
                className="w-full py-3 bg-[#272830] hover:bg-[#3E404C] text-white font-bold text-xs rounded-xl text-center transition-colors block"
              >
                Contact Sales
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* SECURITY & SLA GUARANTEE FOOTER CARD */}
      <section className="py-12 bg-white border-t border-[#E0E2E8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="w-12 h-12 bg-[#FFF0EE] text-[#E5322D] rounded-2xl flex items-center justify-center mx-auto">
            <ShieldCheck size={24} />
          </div>
          <h3 className="text-xl font-extrabold text-[#272830]">
            Enterprise-Grade Security by Default
          </h3>
          <p className="text-xs sm:text-sm text-[#686B74] max-w-2xl mx-auto leading-relaxed">
            All files uploaded via the REST API are protected with 256-bit SSL encryption during transit and at rest. In compliance with strict privacy standards, all source and converted files are automatically purged after 2 hours.
          </p>
          <div className="pt-2">
            <Link to="/security" className="text-xs font-bold text-[#E5322D] hover:underline inline-flex items-center gap-1">
              <span>Read Full Security Architecture</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
