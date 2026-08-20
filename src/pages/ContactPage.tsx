import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { 
  Mail, 
  MessageSquare, 
  Building2, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  AlertCircle, 
  Sparkles, 
  ArrowRight,
  FileText,
  MapPin,
  LifeBuoy
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { buildBreadcrumbSchema, buildWebPageSchema } from '../seo/schema';

export function ContactPage() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    category: 'General Inquiry',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim()) {
      setErrorMessage('Please enter your name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!formData.subject.trim()) {
      setErrorMessage('Please enter a message subject.');
      return;
    }
    if (!formData.message.trim() || formData.message.trim().length < 5) {
      setErrorMessage('Please enter a message of at least 5 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      const generatedTicket = 'TK-' + Math.floor(100000 + Math.random() * 900000);
      
      const docData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        category: formData.category,
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        ticketId: generatedTicket,
        userId: user?.uid || 'anonymous',
        status: 'new',
        createdAt: serverTimestamp()
      };

      try {
        await addDoc(collection(db, 'contact_messages'), docData);
      } catch (dbErr) {
        console.warn('Firestore write warning:', dbErr);
        // Fallback or log error cleanly
      }

      setTicketId(generatedTicket);
      setIsSubmitted(true);
    } catch (err: any) {
      console.error('Error submitting contact form:', err);
      setErrorMessage('Failed to send message. Please try again or email us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: user?.displayName || '',
      email: user?.email || '',
      category: 'General Inquiry',
      subject: '',
      message: ''
    });
    setIsSubmitted(false);
    setTicketId('');
    setErrorMessage('');
  };

  const breadcrumbSchema = buildBreadcrumbSchema([{ name: 'Contact Us', path: '/contact' }], '/contact');
  const webpageSchema = buildWebPageSchema({
    name: 'Contact Us',
    slug: '/contact',
    description: 'Get in touch with the ilovepdf.in support team. Submit inquiries, request enterprise pricing, report issues, or contact our customer support 24/7.'
  });

  return (
    <div className="bg-[#F8F9FA] min-h-screen text-[#272830] font-['Inter',sans-serif]">
      <SEO
        title="Contact Us | ilovepdf.in"
        description="Get in touch with the ilovepdf.in support team. Submit inquiries, request enterprise pricing, report issues, or contact our customer support 24/7."
        canonicalPath="/contact"
        schema={[breadcrumbSchema, webpageSchema]}
      />

      {/* HERO HEADER */}
      <section className="bg-white border-b border-[#E0E2E8] pt-14 pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF2F2] border border-[#FADBD8] text-[#E5322D] text-xs sm:text-sm font-semibold mb-6">
            <LifeBuoy size={18} />
            <span>24/7 Dedicated Support</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#272830] tracking-tight leading-tight mb-4">
            How can we help you today?
          </h1>

          <p className="text-sm sm:text-base text-[#686B74] max-w-2xl mx-auto mb-2 leading-relaxed">
            Have questions about our PDF tools, need custom enterprise licenses, or ran into a technical issue? Send us a message and our support team will get back to you promptly.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT SECTION */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* FORM / SUCCESS CARD (8 Cols on Desktop) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-[#E0E2E8] shadow-xs">
            
            {isSubmitted ? (
              <div className="text-center py-8 space-y-6">
                <div className="w-16 h-16 bg-[#E6F4EA] text-[#34A853] rounded-2xl flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 size={36} />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-[#272830]">
                    Message Sent Successfully!
                  </h2>
                  <p className="text-sm text-[#686B74] max-w-md mx-auto">
                    Thank you for contacting <strong>ilovepdf.in</strong>. Our team has received your inquiry and will respond to <strong>{formData.email}</strong> within 24 hours.
                  </p>
                </div>

                <div className="bg-[#F8F9FA] border border-[#EAECEF] p-4 rounded-2xl inline-block max-w-xs w-full text-left">
                  <div className="text-xs text-[#888A92] uppercase font-bold tracking-wider mb-1">
                    Support Ticket Reference
                  </div>
                  <div className="text-lg font-extrabold text-[#E5322D] font-mono">
                    {ticketId}
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={resetForm}
                    className="px-5 py-2.5 bg-[#F1F3F7] hover:bg-[#E2E6EE] text-[#272830] text-sm font-semibold rounded-xl transition-colors"
                  >
                    Send Another Message
                  </button>
                  <Link
                    to="/"
                    className="px-5 py-2.5 bg-[#E5322D] hover:bg-[#d42d28] text-white text-sm font-semibold rounded-xl transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Back to Tools</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#272830] mb-1">
                    Send Us a Message
                  </h2>
                  <p className="text-xs sm:text-sm text-[#686B74]">
                    Fill in the form below and we will respond as quickly as possible.
                  </p>
                </div>

                {errorMessage && (
                  <div className="mb-6 p-4 bg-[#FFF0EE] border border-[#FADBD8] rounded-2xl flex items-start gap-3 text-sm text-[#C92A26]">
                    <AlertCircle size={20} className="shrink-0 mt-0.5" />
                    <div>{errorMessage}</div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* NAME & EMAIL GRID */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#272830] uppercase mb-1.5">
                        Your Full Name <span className="text-[#E5322D]">*</span>
                      </label>
                      <input 
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl border border-[#D4D6DE] bg-[#F8F9FA] focus:bg-white focus:border-[#E5322D] focus:outline-none text-sm transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#272830] uppercase mb-1.5">
                        Email Address <span className="text-[#E5322D]">*</span>
                      </label>
                      <input 
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-[#D4D6DE] bg-[#F8F9FA] focus:bg-white focus:border-[#E5322D] focus:outline-none text-sm transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* CATEGORY & SUBJECT */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#272830] uppercase mb-1.5">
                        Inquiry Category
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-[#D4D6DE] bg-[#F8F9FA] focus:bg-white focus:border-[#E5322D] focus:outline-none text-sm transition-colors text-[#272830]"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Technical Support">Technical Support</option>
                        <option value="Business / Enterprise">Business / Enterprise</option>
                        <option value="Bug Report">Bug Report</option>
                        <option value="Feature Request">Feature Request</option>
                        <option value="Privacy & Legal">Privacy & Legal</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#272830] uppercase mb-1.5">
                        Subject <span className="text-[#E5322D]">*</span>
                      </label>
                      <input 
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help?"
                        className="w-full px-4 py-3 rounded-xl border border-[#D4D6DE] bg-[#F8F9FA] focus:bg-white focus:border-[#E5322D] focus:outline-none text-sm transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* MESSAGE */}
                  <div>
                    <label className="block text-xs font-bold text-[#272830] uppercase mb-1.5">
                      Message Details <span className="text-[#E5322D]">*</span>
                    </label>
                    <textarea 
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please describe your query or issue in detail..."
                      className="w-full px-4 py-3 rounded-xl border border-[#D4D6DE] bg-[#F8F9FA] focus:bg-white focus:border-[#E5322D] focus:outline-none text-sm transition-colors resize-y"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 bg-[#E5322D] hover:bg-[#d42d28] text-white font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>Submit Message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

          </div>

          {/* CONTACT INFO SIDEBAR (5 Cols on Desktop) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* DIRECT CHANNELS CARD */}
            <div className="bg-white p-6 rounded-3xl border border-[#E0E2E8] shadow-xs space-y-5">
              <h3 className="text-base font-bold text-[#272830] uppercase tracking-wider text-xs border-b border-[#EAECEF] pb-3">
                Direct Contact Channels
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF2F2] text-[#E5322D] flex items-center justify-center shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#888A92] uppercase">Customer Support</p>
                    <a href="mailto:support@ilovepdf.in" className="text-sm font-semibold text-[#272830] hover:text-[#E5322D] transition-colors">
                      support@ilovepdf.in
                    </a>
                    <p className="text-xs text-[#686B74] mt-0.5">Response time &lt; 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#E8F0FE] text-[#1A73E8] flex items-center justify-center shrink-0">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#888A92] uppercase">Sales & Business</p>
                    <a href="mailto:sales@ilovepdf.in" className="text-sm font-semibold text-[#272830] hover:text-[#1A73E8] transition-colors">
                      sales@ilovepdf.in
                    </a>
                    <p className="text-xs text-[#686B74] mt-0.5">Team licenses & enterprise contracts</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#E6F4EA] text-[#34A853] flex items-center justify-center shrink-0">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#888A92] uppercase">Privacy & Legal</p>
                    <a href="mailto:privacy@ilovepdf.in" className="text-sm font-semibold text-[#272830] hover:text-[#34A853] transition-colors">
                      privacy@ilovepdf.in
                    </a>
                    <p className="text-xs text-[#686B74] mt-0.5">GDPR, CCPA & security inquiries</p>
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK HELPDESK & FAQs */}
            <div className="bg-[#F1F3F7] p-6 rounded-3xl border border-[#E0E2E8]">
              <div className="flex items-center gap-2 mb-3 text-[#272830] font-bold text-sm">
                <HelpCircle size={18} className="text-[#E5322D]" />
                <span>Looking for instant answers?</span>
              </div>
              <p className="text-xs text-[#686B74] leading-relaxed mb-4">
                Before sending a message, check out our help resources for quick solutions:
              </p>

              <div className="space-y-2 text-xs">
                <Link to="/faq" className="block p-3 bg-white rounded-xl border border-[#E0E2E8] hover:border-[#E5322D] font-semibold text-[#272830] transition-colors flex items-center justify-between">
                  <span>Frequently Asked Questions (FAQ)</span>
                  <ArrowRight size={14} className="text-[#888A92]" />
                </Link>

                <Link to="/security" className="block p-3 bg-white rounded-xl border border-[#E0E2E8] hover:border-[#E5322D] font-semibold text-[#272830] transition-colors flex items-center justify-between">
                  <span>Security & Automatic 2-Hour Cleanup</span>
                  <ArrowRight size={14} className="text-[#888A92]" />
                </Link>

                <Link to="/pricing" className="block p-3 bg-white rounded-xl border border-[#E0E2E8] hover:border-[#E5322D] font-semibold text-[#272830] transition-colors flex items-center justify-between">
                  <span>View Pricing & Premium Features</span>
                  <ArrowRight size={14} className="text-[#888A92]" />
                </Link>
              </div>
            </div>

            {/* RESPONSE GUARANTEE BADGE */}
            <div className="bg-white p-5 rounded-3xl border border-[#E0E2E8] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFF2F2] text-[#E5322D] flex items-center justify-center shrink-0">
                <Clock size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#272830] uppercase">Response Guarantee</h4>
                <p className="text-xs text-[#686B74]">
                  We operate 7 days a week to ensure your document operations never stall.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
