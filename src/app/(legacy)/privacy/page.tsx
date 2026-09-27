'use client';

import React from 'react';
import Link from 'next/link';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({ subsets: ['latin'], weight: '700' });

export default function PrivacyPage() {
  const currentDate = new Date().toLocaleDateString();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="relative z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <span className={`${montserrat.className} text-2xl font-bold text-white tracking-widest`}>
              LinClone
            </span>
          </Link>
          <Link 
            href="/"
            className="text-white/80 hover:text-white transition-colors duration-300"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/20">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          
          <p className="text-gray-300 mb-8">
            Last Updated: {currentDate}
          </p>

          <div className="space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Introduction
              </h2>
              <p className="text-gray-300 leading-relaxed">
                LinClone is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our AI clone services.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Information We Collect
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>We collect information that you provide directly to us, such as when you create an account, use our AI clone services, or contact us for support.</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Personal information such as name, email address, and contact details</li>
                  <li>Voice recordings and biometric data for AI clone creation</li>
                  <li>Usage data and interaction patterns with our services</li>
                  <li>Device information including IP address, browser type, and operating system</li>
                  <li>Payment information when you subscribe to our services</li>
                </ul>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                How We Use Your Information
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Creating and maintaining your AI clone</li>
                  <li>Processing payments and managing subscriptions</li>
                  <li>Providing customer support and responding to inquiries</li>
                  <li>Improving our services through analytics and research</li>
                  <li>Sending important updates and promotional communications</li>
                  <li>Ensuring security and preventing fraud</li>
                </ul>
              </div>
            </section>

            {/* Information Sharing */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Information Sharing
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
                <p>We may share your information in the following limited circumstances:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>With service providers who help us operate our platform</li>
                  <li>When required by law or to protect our legal rights</li>
                  <li>In connection with a business transaction (merger, acquisition, etc.)</li>
                  <li>With your explicit consent for specific purposes</li>
                </ul>
              </div>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Data Security
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>End-to-end encryption for sensitive data transmission</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Access controls and authentication protocols</li>
                  <li>Secure data storage with industry-standard protection</li>
                  <li>Employee training on data protection practices</li>
                </ul>
              </div>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Your Rights and Choices
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>You have the following rights regarding your personal information:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Portability:</strong> Request a copy of your data in a machine-readable format</li>
                  <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                  <li><strong>Restriction:</strong> Request limitation of how we process your information</li>
                </ul>
              </div>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Data Retention
              </h2>
              <p className="text-gray-300 leading-relaxed">
                We retain your personal information only for as long as necessary to provide our services and fulfill the purposes outlined in this policy. AI clone data is retained for the duration of your account plus a reasonable period for backup and recovery purposes. You can request deletion of your data at any time.
              </p>
            </section>

            {/* Cookies and Tracking */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Cookies and Tracking Technologies
              </h2>
              <p className="text-gray-300 leading-relaxed">
                We use cookies and similar tracking technologies to enhance your experience on our platform. These help us remember your preferences, analyze usage patterns, and provide personalized content. You can control cookie settings through your browser preferences.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Children&apos;s Privacy
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we discover that we have collected information from a child under 13, we will delete it immediately.
              </p>
            </section>

            {/* International Transfers */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                International Data Transfers
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and provide adequate protection for your personal information.
              </p>
            </section>

            {/* Changes to This Policy */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Changes to This Privacy Policy
              </h2>
              <p className="text-gray-300 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the &ldquo;Last Updated&rdquo; date. Your continued use of our services after such changes constitutes acceptance of the updated policy.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Contact Us
              </h2>
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p>If you have any questions about this Privacy Policy, please contact us at privacy@linclone.com</p>
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <h3 className="font-semibold text-white mb-2">LinClone Privacy Team</h3>
                  <p>Email: privacy@linclone.com</p>
                  <p>Address: 123 Tech Street, Innovation District, San Francisco, CA 94105</p>
                  <p>Phone: +1 (555) 123-4567</p>
                </div>
              </div>
            </section>
          </div>

          {/* Back to Home Button */}
          <div className="mt-12 text-center">
            <Link 
              href="/"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Back to LinClone
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
} 