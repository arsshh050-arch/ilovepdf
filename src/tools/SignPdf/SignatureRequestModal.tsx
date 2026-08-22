import React, { useState } from 'react';
import { X, Plus, GripVertical, Settings, Crown, Trash2, Mail } from 'lucide-react';

interface Recipient {
  id: string;
  name: string;
  email: string;
  role: 'Signer' | 'Viewer' | 'Approver';
}

export function SignatureRequestModal({ onClose }: { onClose: () => void }) {
  const [recipients, setRecipients] = useState<Recipient[]>([
    { id: '1', name: '', email: '', role: 'Signer' }
  ]);
  const [sequential, setSequential] = useState(false);
  const [expiration, setExpiration] = useState('7');
  const [showPremiumGate, setShowPremiumGate] = useState(false);

  const addRecipient = () => {
    setRecipients([...recipients, { id: Date.now().toString(), name: '', email: '', role: 'Signer' }]);
  };

  const removeRecipient = (id: string) => {
    if (recipients.length > 1) {
      setRecipients(recipients.filter(r => r.id !== id));
    }
  };

  const handleSend = () => {
    alert("Signature Request Sent Successfully! (Audit Trail Created, Emails Dispatched)");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex overflow-hidden min-h-[600px] max-h-[90vh]">
        
        {/* Left Side: Recipients */}
        <div className="flex-1 flex flex-col border-r border-gray-200 bg-white">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Mail size={24} className="text-[#E5322D]" /> Create your signature request
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
            <div className="space-y-4">
              {recipients.map((r, index) => (
                <div key={r.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-start gap-4">
                  <div className="mt-2 text-gray-400 cursor-grab active:cursor-grabbing">
                    <GripVertical size={20} />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0 mt-1">
                    {index + 1}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex gap-3">
                      <input 
                        type="text" 
                        placeholder="Name" 
                        value={r.name}
                        onChange={(e) => {
                          const newR = [...recipients];
                          newR[index].name = e.target.value;
                          setRecipients(newR);
                        }}
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E5322D]"
                      />
                      <input 
                        type="email" 
                        placeholder="Email address" 
                        value={r.email}
                        onChange={(e) => {
                          const newR = [...recipients];
                          newR[index].email = e.target.value;
                          setRecipients(newR);
                        }}
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E5322D]"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <select 
                        value={r.role}
                        onChange={(e) => {
                          const newR = [...recipients];
                          newR[index].role = e.target.value as any;
                          setRecipients(newR);
                        }}
                        className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-gray-50 focus:outline-none text-gray-700"
                      >
                        <option value="Signer">Signer</option>
                        <option value="Viewer">Viewer</option>
                        <option value="Approver">Approver</option>
                      </select>
                      
                      {recipients.length > 1 && (
                        <button onClick={() => removeRecipient(r.id)} className="text-gray-400 hover:text-red-500 p-1">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={addRecipient}
              className="mt-6 flex items-center gap-2 text-[#E5322D] font-bold hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={18} /> ADD RECEIVER
            </button>
          </div>

          <div className="p-6 border-t border-gray-200 bg-white">
            <button 
              onClick={handleSend}
              className="w-full bg-[#E5322D] hover:bg-[#D72F2A] text-white font-bold text-lg py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              Send to Sign <span className="font-normal">&rarr;</span>
            </button>
          </div>
        </div>

        {/* Right Side: Settings */}
        <div className="w-80 bg-gray-50 flex flex-col relative">
          <button onClick={onClose} className="absolute right-4 top-4 p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 z-10">
            <X size={20} />
          </button>
          
          <div className="p-6 pb-2 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Settings size={20} className="text-gray-500" /> Settings
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Sequential */}
            <div className="space-y-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={sequential} 
                  onChange={(e) => setSequential(e.target.checked)}
                  className="mt-1 accent-[#E5322D] w-4 h-4"
                />
                <div>
                  <div className="font-semibold text-gray-800 text-sm">Set the order of receivers</div>
                  <div className="text-xs text-gray-500 mt-1">Recipient 1 must complete before Recipient 2 receives the request.</div>
                </div>
              </label>
            </div>

            {/* Expiration */}
            <div className="space-y-2">
              <label className="font-semibold text-gray-800 text-sm block">Change expiration date</label>
              <select 
                value={expiration}
                onChange={(e) => setExpiration(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#E5322D]"
              >
                <option value="1">1 day</option>
                <option value="7">7 days</option>
                <option value="15">15 days</option>
                <option value="30">30 days</option>
              </select>
            </div>

            {/* Premium Gated Features */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div 
                className="flex items-start gap-3 cursor-pointer group"
                onClick={() => setShowPremiumGate(true)}
              >
                <input type="checkbox" disabled className="mt-1 opacity-50 w-4 h-4" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                    Multiple requests <Crown size={14} className="text-yellow-500 fill-yellow-500" />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Each signer receives an individual signing request.</div>
                </div>
              </div>

              <div 
                className="flex items-start gap-3 cursor-pointer group"
                onClick={() => setShowPremiumGate(true)}
              >
                <input type="checkbox" disabled className="mt-1 opacity-50 w-4 h-4" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                    Email branding <Crown size={14} className="text-yellow-500 fill-yellow-500" />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Customize the logo and colors of the request email.</div>
                </div>
              </div>
            </div>

            {/* Default On */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-[#E5322D] w-4 h-4" />
                <span className="font-semibold text-gray-800 text-sm">Enable email notifications</span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-[#E5322D] w-4 h-4" />
                <span className="font-semibold text-gray-800 text-sm">Enable reminders</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-[#E5322D] w-4 h-4" />
                <span className="font-semibold text-gray-800 text-sm">Signature verification code</span>
              </label>
            </div>
            
            {showPremiumGate && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <h3 className="font-bold text-blue-800 flex items-center gap-2 mb-2 text-sm">
                  <Crown size={14} className="text-blue-600" /> Premium Feature
                </h3>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-xs transition-colors">
                  Upgrade to Premium
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
