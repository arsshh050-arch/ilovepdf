import React from 'react';
import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function Footer() {
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear().toString();
  const copyrightText = theme?.footer?.copyrightText
    ? theme.footer.copyrightText.replace('%year%', currentYear)
    : `© ${currentYear} iLovePDF.in. All rights reserved.`;

  return (
    <footer className="bg-[#24252A] text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          
          <div>
            <h3 className="font-bold text-[#E5322D] mb-4">Convert PDF</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link to="/pdf-to-word" className="hover:text-white transition-colors">PDF to Word</Link></li>
              <li><Link to="/word-to-pdf" className="hover:text-white transition-colors">Word to PDF</Link></li>
              <li><Link to="/jpg-to-pdf" className="hover:text-white transition-colors">JPG to PDF</Link></li>
              <li><Link to="/pdf-to-jpg" className="hover:text-white transition-colors">PDF to JPG</Link></li>
              <li><Link to="/pdf-to-excel" className="hover:text-white transition-colors">PDF to Excel</Link></li>
              <li><Link to="/pdf-to-powerpoint" className="hover:text-white transition-colors">PDF to Powerpoint</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-[#E5322D] mb-4">Organize PDF</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link to="/merge-pdf" className="hover:text-white transition-colors">Merge PDF</Link></li>
              <li><Link to="/split-pdf" className="hover:text-white transition-colors">Split PDF</Link></li>
              <li><Link to="/remove-pages" className="hover:text-white transition-colors">Remove Pages</Link></li>
              <li><Link to="/extract-pages" className="hover:text-white transition-colors">Extract Pages</Link></li>
              <li><Link to="/organize-pdf" className="hover:text-white transition-colors">Organize PDF</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-[#E5322D] mb-4">Optimize & Edit</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link to="/compress-pdf" className="hover:text-white transition-colors">Compress PDF</Link></li>
              <li><Link to="/edit-pdf" className="hover:text-white transition-colors">PDF Editor</Link></li>
              <li><Link to="/sign-pdf" className="hover:text-white transition-colors">Sign PDF</Link></li>
              <li><Link to="/watermark-pdf" className="hover:text-white transition-colors">Watermark PDF</Link></li>
              <li><Link to="/rotate-pdf" className="hover:text-white transition-colors">Rotate PDF</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-[#E5322D] mb-4">Legal & Company</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              <li><Link to="/security" className="hover:text-white transition-colors">Security</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-[#E5322D] mb-4">Product</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/business" className="hover:text-white transition-colors">Business</Link></li>
              <li><Link to="/api" className="hover:text-white transition-colors">Developer API</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">Help & FAQ</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>

        </div>
        
        <div className="pt-8 border-t border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Globe size={16} />
            <span>English</span>
          </div>
          <div>
            {copyrightText}
          </div>
        </div>
      </div>
    </footer>
  );
}
