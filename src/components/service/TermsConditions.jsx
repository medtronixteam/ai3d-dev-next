'use client';

import React, { useEffect } from 'react';
import '../../pages/CookiePolicy.css';

const TermsConditions = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.classList.add('dashboard-active');
    return () => {
      document.body.classList.remove('dashboard-active');
    };
  }, []);

  return (
    <div className="policy-page-wrapper">
      <div className="policy-container">
        <header className="policy-header">
          <h1>Terms and Conditions</h1>
          <p className="last-updated">Last updated October 9, 2026</p>
        </header>

        <section className="policy-section">
          <p>
            These Terms and Conditions govern your use of the websites, applications, and services offered by{' '}
            <strong>AI 3D Scanning Solutions Inc.</strong> (“AI 3D Scanning”, “3DIO AI”, “we”, “us”, or “our”), including
            the 3DIO AI platform at ai3dscanning.com.
          </p>
          <p>
            By creating an account, uploading content, generating a 3D asset, joining a program, or otherwise using the
            service, you agree to these terms. If you do not agree, do not use the service.
          </p>
        </section>

        <section className="policy-section">
          <h2>The service</h2>
          <p>
            3DIO AI lets you turn images, video, and text into 3D assets, then view, manage, and export those assets.
            Features can include image-to-3D, multi-image generation, video frame extraction, text prompts, project
            history, team workspaces, an API, subscriptions, a contributor program, a student program, and referral
            rewards.
          </p>
          <p>
            We may add, change, or remove features, set usage limits, and pause generation while a job is in a queue.
            Output quality depends on your source files, the selected mode, and available processing capacity. We do not
            promise that every generation will be error-free, production-ready, or suitable for a particular purpose.
          </p>
        </section>

        <section className="policy-section">
          <h2>Accounts</h2>
          <p>
            You must provide accurate account information and keep your login credentials confidential. You are
            responsible for activity that happens under your account. Tell us promptly at{' '}
            <a href="mailto:contact@ai3dscanning.com">contact@ai3dscanning.com</a> if you believe your account has been
            misused.
          </p>
          <p>
            You must be able to form a binding contract. If you use the service for a company, you confirm that you have
            authority to bind that company to these terms.
          </p>
        </section>

        <section className="policy-section">
          <h2>Your content</h2>
          <p>
            You keep ownership of the photos, videos, text prompts, and other materials you upload (“Your Content”).
            You grant us a limited license to host, process, reproduce, and display Your Content only so we can operate
            the service, generate assets, provide support, keep the service secure, and improve reliability.
          </p>
          <p>You confirm that:</p>
          <ul>
            <li>you have the rights needed to upload Your Content and to let us process it;</li>
            <li>Your Content does not infringe someone else’s copyright, trademark, privacy, or other rights;</li>
            <li>you will not upload unlawful, harmful, or deceptive material.</li>
          </ul>
          <p>
            Generated 3D assets are provided for use under the plan or program you are on. Unless a separate written
            agreement says otherwise, you may use assets you generate for your own personal or business projects. You
            may not resell the raw generation service itself, or present our models, interface, or prompts as your own
            product.
          </p>
        </section>

        <section className="policy-section">
          <h2>Acceptable use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>break the law, or violate anyone’s intellectual property or privacy;</li>
            <li>upload content that is illegal, exploitative, or sexually exploitative of minors;</li>
            <li>probe, scan, or attack the service, or bypass usage limits, queues, or access controls;</li>
            <li>use bots or scripts to overload generation, except through an API we expressly provide;</li>
            <li>reverse engineer the service except where the law does not allow this restriction;</li>
            <li>share your account in a way that avoids subscription or seat limits.</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>Plans, payments, and credits</h2>
          <p>
            Some features require a paid subscription, credits, or an enterprise agreement. Prices, included usage, and
            billing periods are shown at checkout or in your plan. Payments are processed by our payment provider.
            Unless the law or a written enterprise agreement requires otherwise, fees already charged are non-refundable.
          </p>
          <p>
            If a payment fails, we may suspend generation or other paid features until the account is current. We may
            change prices for future billing periods. We will show the new price before it applies to a renewal.
          </p>
        </section>

        <section className="policy-section">
          <h2>Contributor, student, and referral programs</h2>
          <p>
            The contributor program, student program, and referral rewards are optional. Each program may have its own
            eligibility rules, review steps, and reward terms shown on that page. We may accept, reject, or end a
            program application, and we may change or stop a program when we give notice on the site.
          </p>
          <p>
            Student access is for academic projects, research, and thesis work. Apply with your official university
            email and the student details we request. Personal email addresses may be declined.
          </p>
        </section>

        <section className="policy-section">
          <h2>Our intellectual property</h2>
          <p>
            The 3DIO AI name, logo, website, software, models, and documentation are owned by AI 3D Scanning Solutions
            Inc. or its licensors. These terms do not transfer that ownership to you. You receive only the limited right
            to use the service as described here.
          </p>
        </section>

        <section className="policy-section">
          <h2>Disclaimers</h2>
          <p>
            The service is provided “as is” and “as available”. To the fullest extent allowed by law, we disclaim
            warranties of merchantability, fitness for a particular purpose, and non-infringement. AI output can be
            inaccurate, incomplete, or similar to other results. You are responsible for reviewing assets before you
            manufacture, publish, or sell them.
          </p>
        </section>

        <section className="policy-section">
          <h2>Limitation of liability</h2>
          <p>
            To the fullest extent allowed by law, AI 3D Scanning Solutions Inc. is not liable for indirect, incidental,
            special, consequential, or lost-profit damages, or for loss of data or content, arising from your use of
            the service. Our total liability for a claim relating to the service is limited to the amount you paid us
            for the service in the three months before the claim, or one hundred U.S. dollars if you paid nothing.
          </p>
          <p>Some places do not allow these limits. In those places, the limits apply only as far as the law allows.</p>
        </section>

        <section className="policy-section">
          <h2>Suspension and termination</h2>
          <p>
            You may stop using the service at any time. We may suspend or close an account if you break these terms,
            create risk for other users, or if we must do so to comply with law. When an account is closed, access to
            projects and generated assets may end, except where we are required to keep a copy.
          </p>
        </section>

        <section className="policy-section">
          <h2>Changes to these terms</h2>
          <p>
            We may update these terms from time to time. The updated version will be posted on this page with a new
            date. If you keep using the service after the update, you accept the revised terms.
          </p>
        </section>

        <section className="policy-section">
          <h2>Contact</h2>
          <p>
            Questions about these terms can be sent to{' '}
            <a href="mailto:contact@ai3dscanning.com">contact@ai3dscanning.com</a>. Please also read our{' '}
            <a href="/cookie-policy">Cookie Policy</a>, which explains how cookies are used on this site.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsConditions;
