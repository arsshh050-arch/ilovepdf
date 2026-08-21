/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { MainLayout } from './layouts/MainLayout';
import { Home } from './pages/Home';
import { PDF_TOOLS } from './config/pdfTools';
import { lazyWithRetry } from './utils/lazyWithRetry';

import { Outlet, useParams } from 'react-router-dom';
import { LANGUAGES, DEFAULT_LANGUAGE } from './i18n/languages';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GoogleAnalyticsTracker } from './components/GoogleAnalyticsTracker';
import { ScrollToTop } from './components/ScrollToTop';

// Lazy loaded routes with resilient retry logic
const MergePdf = lazyWithRetry(() => import('./tools/MergePdf').then(m => ({ default: m.MergePdf })));
const SplitPdf = lazyWithRetry(() => import('./tools/SplitPdf').then(m => ({ default: m.SplitPdf })));
const CompressPdf = lazyWithRetry(() => import('./tools/CompressPdf').then(m => ({ default: m.CompressPdf })));
const ProtectPdf = lazyWithRetry(() => import('./tools/ProtectPdf').then(m => ({ default: m.ProtectPdf })));
const UnlockPdf = lazyWithRetry(() => import('./tools/UnlockPdf').then(m => ({ default: m.UnlockPdf })));
const GenericTool = lazyWithRetry(() => import('./tools/GenericTool').then(m => ({ default: m.GenericTool })));
const EditPdf = lazyWithRetry(() => import('./tools/EditPdf').then(m => ({ default: m.EditPdf })));
const GenericInfoPage = lazyWithRetry(() => import('./pages/info/GenericInfoPage').then(m => ({ default: m.GenericInfoPage })));
const FaqPage = lazyWithRetry(() => import('./pages/FaqPage').then(m => ({ default: m.FaqPage })));
const AboutPage = lazyWithRetry(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage = lazyWithRetry(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const FeaturesPage = lazyWithRetry(() => import('./pages/FeaturesPage').then(m => ({ default: m.FeaturesPage })));
const SecurityPage = lazyWithRetry(() => import('./pages/SecurityPage').then(m => ({ default: m.SecurityPage })));
const PrivacyPolicyPage = lazyWithRetry(() => import('./pages/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
const TermsPage = lazyWithRetry(() => import('./pages/TermsPage').then(m => ({ default: m.TermsPage })));
const CookiePolicyPage = lazyWithRetry(() => import('./pages/CookiePolicyPage').then(m => ({ default: m.CookiePolicyPage })));
const PricingPage = lazyWithRetry(() => import('./pages/PricingPage').then(m => ({ default: m.PricingPage })));
const BusinessPage = lazyWithRetry(() => import('./pages/BusinessPage').then(m => ({ default: m.BusinessPage })));
const DeveloperApiPage = lazyWithRetry(() => import('./pages/DeveloperApiPage').then(m => ({ default: m.DeveloperApiPage })));
const ToolResultPage = lazyWithRetry(() => import('./pages/ToolResultPage').then(m => ({ default: m.ToolResultPage })));
const NotFoundPage = lazyWithRetry(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));
const AllPdfToolsPage = lazyWithRetry(() => import('./pages/AllPdfToolsPage').then(m => ({ default: m.AllPdfToolsPage })));

const Login = lazyWithRetry(() => import('./pages/auth/Login').then(m => ({ default: m.Login })));
const Signup = lazyWithRetry(() => import('./pages/auth/Signup').then(m => ({ default: m.Signup })));
const ForgotPassword = lazyWithRetry(() => import('./pages/auth/ForgotPassword').then(m => ({ default: m.ForgotPassword })));

const SPECIFIC_TOOLS = ['merge-pdf', 'split-pdf', 'compress-pdf', 'protect-pdf', 'unlock-pdf'];
const INFO_ROUTES = ['image-tools', 'sign-pdf', 'integrations', 'desktop', 'mobile', 'help'];





function LocaleWrapper() {
  const { locale } = useParams();
  const { i18n } = useTranslation();
  
  const currentLang = LANGUAGES.find(l => l.code === locale);
  const isValidLocale = !!currentLang;
  
  useEffect(() => {
    if (isValidLocale && currentLang) {
      document.documentElement.lang = currentLang.code;
      document.documentElement.dir = currentLang.direction;
      if (i18n.language !== currentLang.code) {
        i18n.changeLanguage(currentLang.code);
      }
    } else {
      document.documentElement.lang = DEFAULT_LANGUAGE;
      document.documentElement.dir = 'ltr';
      if (i18n.language !== DEFAULT_LANGUAGE) {
        i18n.changeLanguage(DEFAULT_LANGUAGE);
      }
    }
  }, [locale, isValidLocale, currentLang, i18n]);
  
  if (!isValidLocale && locale) {
    return <Navigate to="/404" replace />;
  }
  
  return <Outlet />;
}


function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
      <div className="w-10 h-10 border-3 border-[#E5322D] border-t-transparent rounded-full animate-spin mb-3"></div>
      <p className="text-xs font-medium text-gray-500">Loading iLovePDF...</p>
    </div>
  );
}


const PublicRoutes = () => (
  <>
    {/* Public Auth Routes */}
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
                <Route path="forgot-password" element={<ForgotPassword />} />

                {/* Main Public Website Routes */}
                <Route element={<MainLayout />}>
                  <Route path="" element={<Home />} />

                  <Route path="merge-pdf" element={<MergePdf />} />
                  <Route path="split-pdf" element={<SplitPdf />} />
                  <Route path="compress-pdf" element={<CompressPdf />} />
                  <Route path="protect-pdf" element={<ProtectPdf />} />
                  <Route path="unlock-pdf" element={<UnlockPdf />} />

                  <Route path="pdf-to-word" element={<GenericTool />} />
                  <Route path="pdf-to-jpg" element={<GenericTool />} />
                  <Route path="jpg-to-pdf" element={<GenericTool />} />
                  <Route path="pdf-to-powerpoint" element={<GenericTool />} />
                  <Route path="pdf-to-excel" element={<GenericTool />} />
                  <Route path="word-to-pdf" element={<GenericTool />} />
                  <Route path="powerpoint-to-pdf" element={<GenericTool />} />
                  <Route path="excel-to-pdf" element={<GenericTool />} />
                  <Route path="edit-pdf" element={<EditPdf />} />
                  <Route path="sign-pdf" element={<GenericTool />} />
                  <Route path="watermark-pdf" element={<GenericTool />} />
                  <Route path="rotate-pdf" element={<GenericTool />} />
                  <Route path="html-to-pdf" element={<GenericTool />} />
                  <Route path="organize-pdf" element={<GenericTool />} />
                  <Route path="pdf-to-pdfa" element={<GenericTool />} />
                  <Route path="repair-pdf" element={<GenericTool />} />
                  <Route path="add-page-numbers" element={<GenericTool />} />
                  <Route path="scan-to-pdf" element={<GenericTool />} />
                  <Route path="ocr-pdf" element={<GenericTool />} />
                  <Route path="compare-pdf" element={<GenericTool />} />
                  <Route path="redact-pdf" element={<GenericTool />} />
                  <Route path="crop-pdf" element={<GenericTool />} />
                  <Route path="pdf-forms" element={<GenericTool />} />
                  <Route path="ai-pdf-summarizer" element={<GenericTool />} />
                  <Route path="translate-pdf" element={<GenericTool />} />
                  <Route path="pdf-to-markdown" element={<GenericTool />} />
                  <Route path="remove-pages" element={<GenericTool />} />
                  <Route path="extract-pages" element={<GenericTool />} />
                  <Route path="png-to-pdf" element={<GenericTool />} />
                  <Route path="pdf-to-png" element={<GenericTool />} />
                  <Route path="pdf-to-txt" element={<GenericTool />} />
                  <Route path="txt-to-pdf" element={<GenericTool />} />
                  <Route path="pdf-to-html" element={<GenericTool />} />
                  <Route path="remove-pdf-metadata" element={<GenericTool />} />
                  <Route path="flatten-pdf" element={<GenericTool />} />
                  <Route path="extract-pdf-text" element={<GenericTool />} />
                  <Route path="pdf-question-answer" element={<GenericTool />} />
                  <Route path="extract-pdf-tables" element={<GenericTool />} />
                  <Route path="annotate-pdf" element={<GenericTool />} />
                  <Route path="add-text-pdf" element={<GenericTool />} />
                  <Route path="add-image-pdf" element={<GenericTool />} />

                  <Route path="faq" element={<FaqPage />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="contact-us" element={<ContactPage />} />
                  <Route path="features" element={<FeaturesPage />} />
                  <Route path="security" element={<SecurityPage />} />
                  <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="privacy" element={<PrivacyPolicyPage />} />
                  <Route path="terms" element={<TermsPage />} />
                  <Route path="terms-and-conditions" element={<TermsPage />} />
                  <Route path="cookie-policy" element={<CookiePolicyPage />} />
                  <Route path="cookies" element={<CookiePolicyPage />} />
                  <Route path="pricing" element={<PricingPage />} />
                  <Route path="business" element={<BusinessPage />} />
                  <Route path="api" element={<DeveloperApiPage />} />
                  <Route path="developer-api" element={<DeveloperApiPage />} />
                  <Route path="pdf-api" element={<DeveloperApiPage />} />
                  <Route path="developers" element={<DeveloperApiPage />} />

                  {/* All PDF Tools Routes */}
                  <Route path="pdf-tools" element={<AllPdfToolsPage />} />
                  <Route path="all-pdf-tools" element={<AllPdfToolsPage />} />
                  <Route path="pdf_tools" element={<AllPdfToolsPage />} />
                  <Route path="all-tools" element={<AllPdfToolsPage />} />

                  <Route path="convert-pdf" element={<AllPdfToolsPage />} />
                  <Route path="organize-pdf-tools" element={<AllPdfToolsPage />} />
                  <Route path="edit-pdf-tools" element={<AllPdfToolsPage />} />
                  <Route path="pdf-security" element={<AllPdfToolsPage />} />
                  <Route path="pdf-ai-tools" element={<AllPdfToolsPage />} />
                  <Route path="tools" element={<AllPdfToolsPage />} />

                  {/* Tool Result Pages */}
                  <Route path=":toolSlug/result/:sessionId" element={<ToolResultPage />} />
                  <Route path=":toolSlug/result" element={<ToolResultPage />} />

                  {/* Dynamically map remaining tools */}
                  {PDF_TOOLS.filter(t => !SPECIFIC_TOOLS.includes(t.id)).map(tool => (
                    // @ts-ignore
                    <Route key={tool.id} path={tool.slug.replace(/^\//, '')} element={<GenericTool />} />
                  ))}

                  {/* Info routes for header navigation */}
                  {INFO_ROUTES.map(route => (
                    // @ts-ignore
                    <Route key={route} path={route} element={<GenericInfoPage />} />
                  ))}

                  {/* Catch-all 404 Route */}
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              
  </>
);

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <ScrollToTop />
            <GoogleAnalyticsTracker />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Default English Routes */}
                {PublicRoutes()}

                {/* Localized Routes */}
                <Route path=":locale" element={<LocaleWrapper />}>
                  {PublicRoutes()}
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}
