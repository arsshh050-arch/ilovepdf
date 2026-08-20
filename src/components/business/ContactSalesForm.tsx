import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export function ContactSalesForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    teamSize: '1-10',
    country: 'United States',
    message: '',
    honeypot: '',
    agreeUpdates: false
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.company.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill out all required fields.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/business/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
      } else {
        setErrorMessage(data.error || 'Failed to send request. Please try again.');
        setStatus('error');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setErrorMessage('A network error occurred. Please try again later.');
      setStatus('error');
    }
  };

  return (
    <section id="contact-sales" className="py-16 md:py-20 bg-[#F7F8FC] border-b border-[#E0E2E8]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-[#E0E2E8] p-8 md:p-12 shadow-sm">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E5322D] bg-[#FFF0EE] px-3.5 py-1 rounded-full">
              Get In Touch
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#272830] mt-4 mb-3">
              Talk to our business team
            </h2>
            <p className="text-base text-[#686B74]">
              Tell us about your document workflow and we'll help you find the right setup.
            </p>
          </div>

          {status === 'success' ? (
            <div className="bg-[#E6F4EA] border border-[#34A853] rounded-2xl p-8 text-center my-6">
              <div className="w-14 h-14 rounded-full bg-[#34A853] text-white flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-[#1B5E20] mb-2">
                Thanks. Your request has been received.
              </h3>
              <p className="text-sm text-[#2E7D32]">
                Our business solutions specialist will review your inquiry and reach out within 1 business day.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {status === 'error' && (
                <div className="p-4 rounded-xl bg-[#FCE8E6] border border-[#EA4335] text-sm text-[#C5221F] flex items-center gap-3">
                  <AlertCircle size={20} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Honeypot field - anti-spam hidden */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="honeypot">Leave this blank</label>
                <input
                  type="text"
                  id="honeypot"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {/* FIRST & LAST NAME */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-xs font-bold uppercase text-[#272830] mb-2">
                    First name <span className="text-[#E5322D]">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="e.g. Sarah"
                    className="w-full h-12 px-4 rounded-xl border border-[#D4D6DE] bg-white text-sm text-[#272830] focus:outline-none focus:border-[#E5322D] focus:ring-1 focus:ring-[#E5322D]"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-xs font-bold uppercase text-[#272830] mb-2">
                    Last name <span className="text-[#E5322D]">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="e.g. Jenkins"
                    className="w-full h-12 px-4 rounded-xl border border-[#D4D6DE] bg-white text-sm text-[#272830] focus:outline-none focus:border-[#E5322D] focus:ring-1 focus:ring-[#E5322D]"
                  />
                </div>
              </div>

              {/* COMPANY & EMAIL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="company" className="block text-xs font-bold uppercase text-[#272830] mb-2">
                    Company name <span className="text-[#E5322D]">*</span>
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g. Acme Legal Corp"
                    className="w-full h-12 px-4 rounded-xl border border-[#D4D6DE] bg-white text-sm text-[#272830] focus:outline-none focus:border-[#E5322D] focus:ring-1 focus:ring-[#E5322D]"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-bold uppercase text-[#272830] mb-2">
                    Business email <span className="text-[#E5322D]">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="sarah@company.com"
                    className="w-full h-12 px-4 rounded-xl border border-[#D4D6DE] bg-white text-sm text-[#272830] focus:outline-none focus:border-[#E5322D] focus:ring-1 focus:ring-[#E5322D]"
                  />
                </div>
              </div>

              {/* TEAM SIZE & COUNTRY */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="teamSize" className="block text-xs font-bold uppercase text-[#272830] mb-2">
                    Team size
                  </label>
                  <select
                    id="teamSize"
                    name="teamSize"
                    value={formData.teamSize}
                    onChange={handleChange}
                    className="w-full h-12 px-4 rounded-xl border border-[#D4D6DE] bg-white text-sm text-[#272830] focus:outline-none focus:border-[#E5322D] focus:ring-1 focus:ring-[#E5322D]"
                  >
                    <option value="1-10">1 - 10 employees</option>
                    <option value="11-50">11 - 50 employees</option>
                    <option value="51-200">51 - 200 employees</option>
                    <option value="201-500">201 - 500 employees</option>
                    <option value="500+">500+ employees</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="country" className="block text-xs font-bold uppercase text-[#272830] mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="e.g. United States"
                    className="w-full h-12 px-4 rounded-xl border border-[#D4D6DE] bg-white text-sm text-[#272830] focus:outline-none focus:border-[#E5322D] focus:ring-1 focus:ring-[#E5322D]"
                  />
                </div>
              </div>

              {/* MESSAGE */}
              <div>
                <label htmlFor="message" className="block text-xs font-bold uppercase text-[#272830] mb-2">
                  Message <span className="text-[#E5322D]">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your document volume, required PDF tools, or API requirements..."
                  className="w-full p-4 rounded-xl border border-[#D4D6DE] bg-white text-sm text-[#272830] focus:outline-none focus:border-[#E5322D] focus:ring-1 focus:ring-[#E5322D]"
                ></textarea>
              </div>

              {/* MARKETING CONSENT - NOT PRESELECTED */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agreeUpdates"
                  name="agreeUpdates"
                  checked={formData.agreeUpdates}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-[#E5322D] focus:ring-[#E5322D]"
                />
                <label htmlFor="agreeUpdates" className="text-xs text-[#686B74] leading-relaxed">
                  I agree to receive product news, PDF productivity tips, and business updates from ilovepdf.in. You can unsubscribe at any time.
                </label>
              </div>

              {/* PRIVACY & TERMS LINKS */}
              <p className="text-xs text-[#737680]">
                By submitting this form, you agree to our{' '}
                <Link to="/terms" className="text-[#E5322D] underline">
                  Terms of Service
                </Link>{' '}
                and acknowledge our{' '}
                <Link to="/privacy-policy" className="text-[#E5322D] underline">
                  Privacy Policy
                </Link>
                .
              </p>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full h-13 bg-[#E5322D] hover:bg-[#d42d28] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Send Business Request</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
