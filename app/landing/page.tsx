'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  useEffect(() => {
    // Force video playback and mute state for browser autoplay compliance
    const bgVideo = document.getElementById('bg-video') as HTMLVideoElement | null;
    if (bgVideo) {
      bgVideo.muted = true;
      bgVideo.play().catch((err) => console.warn('Video autoplay policy override:', err));
    }
  }, []);

  const headlineLine1 = ['Learn', 'Python.'];
  const headlineLine2 = ['Keep', 'Everything', 'You', 'Learn.'];
  const logoLetters = ['C', 'o', 'd', 'e', 'B', 'o', 'o', 'k'];

  return (
    <div className="landing-body">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        @import url('https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .landing-body {
          background-color: #000000;
          min-height: 100vh;
          width: 100vw;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow-x: hidden;
          position: relative;
        }

        /* 1. Glassy Top Navbar */
        .glass-navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 72px;
          z-index: 100;
          background: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
        }

        .nav-container {
          max-width: 1200px;
          height: 100%;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          text-decoration: none;
          color: #ffffff;
          font-family: 'General Sans', -apple-system, sans-serif;
          font-weight: 600;
          font-size: 1.25rem;
          letter-spacing: -0.02em;
        }

        .brand-symbol {
          color: #ffffff;
          font-size: 1.3rem;
          opacity: 0.9;
        }

        .free-pill {
          font-family: 'Outfit', sans-serif;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          color: rgba(255, 255, 255, 0.8);
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.18);
          padding: 0.2rem 0.55rem;
          border-radius: 9999px;
          margin-left: 0.2rem;
        }

        .nav-menu {
          display: flex;
          align-items: center;
          gap: 2.2rem;
        }

        .nav-link {
          font-family: 'Outfit', sans-serif;
          font-size: 0.95rem;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: all 0.25s ease;
        }

        .nav-link:hover {
          color: #ffffff;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 1.2rem;
        }

        .nav-login {
          font-family: 'Outfit', sans-serif;
          font-size: 0.95rem;
          font-weight: 500;
          color: #ffffff;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 9999px;
          padding: 0.5rem 1.3rem;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .nav-login:hover {
          background: rgba(255, 255, 255, 0.16);
          border-color: rgba(255, 255, 255, 0.4);
        }

        /* 2. Soft Ambient Background Glow (Monochrome) */
        .hero-glow-bg {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 75vw;
          height: 70vh;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 40%, rgba(0, 0, 0, 0) 70%);
          filter: blur(100px);
          z-index: 0;
          pointer-events: none;
        }

        #top-gradient {
          position: fixed;
          top: -20vh;
          left: 0;
          width: 100vw;
          height: auto;
          display: block;
          z-index: 1;
          pointer-events: none;
          opacity: 0.85;
        }

        /* 3. Hero Content */
        .hero-content {
          position: relative;
          z-index: 5;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding-top: 110px;
          padding-bottom: 3rem;
          width: 90%;
          max-width: 950px;
          margin: 0 auto;
          flex: 1;
          justify-content: center;
        }

        .eyebrow-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.45rem 1.25rem;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 9999px;
          margin-bottom: 1.5rem;
          backdrop-filter: blur(12px);
        }

        .eyebrow-text {
          font-family: 'Outfit', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          color: rgba(255, 255, 255, 0.85);
          text-transform: uppercase;
        }

        .hero-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(2.4rem, 4.4vw, 3.8rem);
          font-weight: 400;
          color: #ffffff;
          line-height: 1.18;
          margin-bottom: 1.5rem;
          letter-spacing: -0.015em;
          text-shadow: 0 4px 30px rgba(0, 0, 0, 0.8);
        }

        .word-wrapper {
          display: inline-block;
          overflow: hidden;
          vertical-align: bottom;
          padding-bottom: 0.12em;
          margin-bottom: -0.12em;
          margin-right: 0.35em;
        }

        .word-inner {
          display: inline-block;
          opacity: 0;
          transform: translateY(105%);
          filter: blur(15px);
          animation: word-reveal-mask 1.2s cubic-bezier(0.05, 0.9, 0.1, 1) forwards;
        }

        @keyframes word-reveal-mask {
          0%   { opacity: 0; transform: translateY(105%); filter: blur(15px); }
          30%  { opacity: 1; }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }

        .hero-description {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(1.02rem, 1.8vw, 1.25rem);
          font-weight: 400;
          color: rgba(255, 255, 255, 0.75);
          line-height: 1.6;
          max-width: 680px;
          margin: 0 auto 2.2rem auto;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
        }

        .hero-cta-group {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          margin-bottom: 1.5rem;
        }

        .cta-primary {
          font-family: 'Outfit', sans-serif;
          font-size: 1.05rem;
          font-weight: 600;
          letter-spacing: 0.01em;
          color: #000000;
          background-color: #ffffff;
          border: 1px solid #ffffff;
          padding: 1.1rem 2.4rem;
          border-radius: 9999px;
          display: inline-flex;
          align-items: center;
          gap: 0.7rem;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 25px rgba(255, 255, 255, 0.15);
          text-decoration: none;
        }

        .cta-primary:hover {
          background-color: #f0f0f0;
          border-color: #f0f0f0;
          transform: translateY(-2px);
          box-shadow: 0 6px 30px rgba(255, 255, 255, 0.25);
        }

        .cta-secondary {
          font-family: 'Outfit', sans-serif;
          font-size: 1.05rem;
          font-weight: 500;
          letter-spacing: 0.01em;
          color: #ffffff;
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.25);
          padding: 1.1rem 2.2rem;
          border-radius: 9999px;
          display: inline-flex;
          align-items: center;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          backdrop-filter: blur(10px);
          text-decoration: none;
        }

        .cta-secondary:hover {
          background-color: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.45);
          color: #ffffff;
          transform: translateY(-2px);
        }

        .trust-reassurance {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-family: 'Outfit', sans-serif;
          font-size: 0.88rem;
          color: rgba(255, 255, 255, 0.55);
          margin-bottom: 2.2rem;
        }

        .bullet-dot {
          color: rgba(255, 255, 255, 0.3);
          font-size: 0.75rem;
        }

        .value-points {
          display: flex;
          align-items: center;
          gap: 2.2rem;
          padding-top: 0.2rem;
        }

        .value-item {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          font-family: 'Outfit', sans-serif;
          font-size: 0.88rem;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.65);
        }

        /* 4. Footer */
        .footer-section {
          position: relative;
          z-index: 5;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.7) 70%, transparent 100%);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          padding-top: 1.2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          margin-top: auto;
        }

        .footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .footer-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          width: 100%;
        }

        .footer-title {
          font-family: 'General Sans', -apple-system, sans-serif;
          font-size: 1.25rem;
          font-weight: 400;
          color: #ffffff;
          letter-spacing: -0.015em;
          margin: 0;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
        }

        .footer-divider {
          border: none;
          height: 1px;
          background-color: rgba(255, 255, 255, 0.15);
          margin: 0.9rem 0;
          width: 100%;
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding-bottom: 0.4rem;
        }

        .footer-socials {
          display: flex;
          gap: 1.25rem;
          align-items: center;
          flex: 1;
        }

        .social-icon {
          color: rgba(255, 255, 255, 0.6);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
        }

        .social-icon:hover {
          color: #ffffff;
          transform: translateY(-2px);
        }

        .footer-links {
          display: flex;
          gap: 2.5rem;
          justify-content: center;
          align-items: center;
          flex: 2;
        }

        .footer-link {
          font-family: 'Outfit', sans-serif;
          font-size: 0.92rem;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          letter-spacing: 0.03em;
          transition: opacity 0.3s ease, transform 0.3s ease;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
        }

        .footer-link:hover {
          color: #ffffff;
          transform: translateY(-1px);
        }

        .footer-copyright {
          font-family: 'Outfit', sans-serif;
          font-size: 0.92rem;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.5);
          text-align: right;
          flex: 1;
          letter-spacing: 0.02em;
        }

        .footer-logo-wrap {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          pointer-events: none;
          margin-top: -0.5rem;
        }

        .footer-logo-text {
          font-family: 'General Sans', -apple-system, sans-serif;
          font-size: clamp(14vw, 21.9vw, 22vw);
          font-weight: 400;
          color: rgba(255, 255, 255, 0.85);
          letter-spacing: -0.04em;
          line-height: 0.75;
          text-align: center;
          width: 100%;
          white-space: nowrap;
          margin: 0;
        }

        .letter-wrapper {
          display: inline-block;
          overflow: hidden;
          vertical-align: bottom;
          line-height: 0.8;
        }

        .letter-inner {
          display: inline-block;
          opacity: 0;
          transform: translateX(-105%);
          filter: blur(15px);
          animation: letter-reveal-mask 1.2s cubic-bezier(0.05, 0.9, 0.1, 1) forwards;
        }

        @keyframes letter-reveal-mask {
          0%   { opacity: 0; transform: translateX(-105%); filter: blur(15px); }
          25%  { opacity: 1; }
          100% { opacity: 0.85; transform: translateX(0); filter: blur(0); }
        }

        .video-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          z-index: 0;
        }

        #bg-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
      `}</style>

      {/* 1. Glassy Top Navbar */}
      <header className="glass-navbar">
        <div className="nav-container">
          <Link href="/" className="nav-brand">
            <span className="brand-symbol">◈</span>
            <span className="brand-name">CodeBook</span>
            <span className="free-pill">100% FREE</span>
          </Link>

          <nav className="nav-menu">
            <Link href="/about" className="nav-link">About</Link>
            <Link href="/docs" className="nav-link">Docs</Link>
          </nav>

          <div className="nav-actions">
            <Link href="/login" className="nav-login">Sign In</Link>
          </div>
        </div>
      </header>

      {/* Ambient Radial Glow (Monochrome) */}
      <div className="hero-glow-bg"></div>

      {/* 2. Background Video */}
      <div className="video-container">
        <video autoPlay muted playsInline loop id="bg-video">
          <source src="/flower.mp4" type="video/mp4" />
          Your browser does not support video.
        </video>
      </div>

      {/* 3. Top Gradient Overlay */}
      <img
        src="https://api.getlayers.ai/storage/v1/object/public/public/assets/loopstack-f8c64439bf/black_gradient.svg"
        alt="Top Gradient"
        id="top-gradient"
      />

      {/* 4. Hero Content */}
      <main className="hero-content">
        <div className="eyebrow-badge">
          <span className="eyebrow-text">YOUR DIGITAL PROGRAMMING NOTEBOOK</span>
        </div>

        <h1 className="hero-title">
          <div>
            {headlineLine1.map((word, index) => (
              <span key={`l1-${index}`} className="word-wrapper">
                <span className="word-inner" style={{ animationDelay: `${index * 0.12}s` }}>
                  {word}
                </span>
              </span>
            ))}
          </div>
          <div>
            {headlineLine2.map((word, index) => (
              <span key={`l2-${index}`} className="word-wrapper">
                <span className="word-inner" style={{ animationDelay: `${(index + 2) * 0.12}s` }}>
                  {word}
                </span>
              </span>
            ))}
          </div>
        </h1>

        <p className="hero-description">
          Write notes, practice code, run examples, and build a personal programming knowledge base you can keep forever.
        </p>

        <div className="hero-cta-group">
          <Link href="/notebook" className="cta-primary">
            <span>Start Learning</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </Link>
          <Link href="/about" className="cta-secondary">
            Explore the Notebook
          </Link>
        </div>

        <div className="trust-reassurance">
          <span>Free to use</span>
          <span className="bullet-dot">•</span>
          <span>No setup</span>
          <span className="bullet-dot">•</span>
          <span>Learn at your own pace</span>
        </div>

        <div className="value-points">
          <div className="value-item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            <span>Write &amp; save notes</span>
          </div>
          <div className="value-item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            <span>Run real Python</span>
          </div>
          <div className="value-item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
            <span>Build your knowledge base</span>
          </div>
        </div>
      </main>

      {/* 5. Footer */}
      <footer className="footer-section">
        <div className="footer-inner">
          <div className="footer-top">
            <h2 className="footer-title">Stay in Touch</h2>
            <h2 className="footer-title quote">Think. Code. Repeat.</h2>
          </div>

          <hr className="footer-divider" />

          <div className="footer-bottom">
            <div className="footer-socials">
              <a href="https://github.com/Deep-Mhatre" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="social-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
              </a>
              <a href="https://www.linkedin.com/in/deep-mhatre-021b832a9/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="https://deep-portfolio-eight.vercel.app/" target="_blank" rel="noopener noreferrer" aria-label="Portfolio" className="social-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
              </a>
            </div>

            <nav className="footer-links">
              <Link href="/about" className="footer-link">About</Link>
              <Link href="/docs" className="footer-link">Docs</Link>
              <Link href="/login" className="footer-link">Login</Link>
            </nav>

            <div className="footer-copyright">
              © 2026 CodeBook
            </div>
          </div>
        </div>

        <div className="footer-logo-wrap">
          <h2 className="footer-logo-text">
            {logoLetters.map((char, index) => (
              <span key={`char-${index}`} className="letter-wrapper">
                <span className="letter-inner" style={{ animationDelay: `${index * 0.09}s` }}>
                  {char}
                </span>
              </span>
            ))}
          </h2>
        </div>
      </footer>
    </div>
  );
}
