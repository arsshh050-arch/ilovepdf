import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ShieldCheck, Search, FileCheck, CheckCircle2, QrCode } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

export function VerifySignaturePage() {
  const [file, setFile] = useState<File | null>(null);
  const [verifyCode, setVerifyCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<any>(null);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false
  });

  const handleVerify = () => {
    if (!file && !verifyCode) {
      alert("Please upload a file or enter a verification code.");
      return;
    }
    
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setResult({
        status: 'valid',
        documentHash: 'a8f5f167f44f4964e6c998dee827110c',
        signer: 'John Doe (john@example.com)',
        timestamp: new Date().toLocaleString(),
        integrity: 'Document has not been modified since it was signed.'
      });
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F3F4F7]">
      <Helmet>
        <title>Verify PDF Signature - ilovepdf.in</title>
        <meta name="description" content="Verify the authenticity and integrity of signed PDF documents." />
      </Helmet>
      <Header />
      
      <main className="flex-grow pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-800">Verify Digital Signatures</h1>
            <p className="text-lg text-gray-600">Check the validity and audit trail of your signed documents.</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
            
            {/* Left Upload Area */}
            <div className="flex-1 p-8 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/50">
              <h2 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FileCheck className="text-[#E5322D]" /> Upload Signed Document
              </h2>
              
              <div 
                {...getRootProps()} 
                className={`w-full h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-colors
                  ${isDragActive ? 'border-[#E5322D] bg-red-50' : 'border-gray-300 bg-white hover:bg-gray-50'}
                `}
              >
                <input {...getInputProps()} />
                {file ? (
                  <div className="text-[#E5322D]">
                    <FileCheck size={48} className="mx-auto mb-3" />
                    <p className="font-bold text-gray-800 truncate w-full">{file.name}</p>
                    <p className="text-sm text-gray-500 mt-1">Click to replace file</p>
                  </div>
                ) : (
                  <div>
                    <ShieldCheck size={48} className="mx-auto mb-3 text-gray-400" />
                    <p className="font-bold text-gray-700">Drop your signed PDF here</p>
                    <p className="text-sm text-gray-500 mt-2">or click to browse</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Code Area */}
            <div className="flex-1 p-8">
              <h2 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                <QrCode className="text-[#E5322D]" /> Enter Verification Code
              </h2>
              
              <div className="space-y-6">
                <p className="text-sm text-gray-600">If you have a document ID or verification code, enter it below.</p>
                <input 
                  type="text" 
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  placeholder="e.g., ILP-7B93-XQ2L"
                  className="w-full border-2 border-gray-200 rounded-xl p-4 text-center text-lg tracking-widest uppercase focus:outline-none focus:border-[#E5322D] font-mono"
                />
                
                <button 
                  onClick={handleVerify}
                  disabled={!file && !verifyCode}
                  className="w-full bg-[#E5322D] hover:bg-[#D72F2A] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-lg shadow-md"
                >
                  {isVerifying ? 'Verifying...' : <><Search size={20} /> Verify Document</>}
                </button>
              </div>
            </div>
          </div>

          {/* Results Area */}
          {result && (
            <div className="bg-white rounded-3xl shadow-xl p-8 border-t-8 border-green-500 transform animate-fade-in-up">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-full text-green-600">
                  <CheckCircle2 size={32} />
                </div>
                <div className="flex-1 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Signature is Valid</h2>
                    <p className="text-green-600 font-medium">{result.integrity}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <div>
                      <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Signer</span>
                      <span className="text-gray-800 font-medium">{result.signer}</span>
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Timestamp</span>
                      <span className="text-gray-800 font-medium">{result.timestamp}</span>
                    </div>
                    <div className="md:col-span-2">
                      <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Document Hash (SHA-256)</span>
                      <span className="text-gray-600 font-mono text-sm break-all">{result.documentHash}</span>
                    </div>
                  </div>
                  
                  <div>
                    <button className="text-[#E5322D] font-bold text-sm hover:underline">View Full Audit Trail &rarr;</button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}
