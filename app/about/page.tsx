'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function AboutPage() {
  useEffect(() => {
    const bgVideo = document.getElementById('bg-video') as HTMLVideoElement | null;
    if (bgVideo) {
      bgVideo.muted = true;
      bgVideo.play().catch((err) => console.warn('Video autoplay policy override:', err));
    }
  }, []);

  return (
    <div className="about-container">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        @import url('https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background-color: #000000;
          color: #ffffff;
          font-family: 'Outfit', sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
          position: relative;
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

        .nav-link:hover, .nav-link.active {
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

        .about-content {
          position: relative;
          z-index: 5;
          max-width: 920px;
          margin: 0 auto;
          padding: 130px 2rem 100px 2rem;
        }

        .eyebrow {
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          margin-bottom: 1rem;
        }

        .about-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(2.5rem, 4vw, 3.8rem);
          font-weight: 400;
          line-height: 1.15;
          margin-bottom: 2rem;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
        }

        .lead-text {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.85);
          line-height: 1.7;
          margin-bottom: 3rem;
          font-weight: 300;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
        }

        .grid-3 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.8rem;
          margin-bottom: 3.5rem;
        }

        .card {
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          padding: 2rem;
          transition: all 0.3s ease;
        }

        .card:hover {
          background: rgba(0, 0, 0, 0.7);
          border-color: rgba(255, 255, 255, 0.28);
          transform: translateY(-2px);
        }

        .card-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.2rem;
          color: #ffffff;
        }

        .card-title {
          font-size: 1.2rem;
          font-weight: 500;
          margin-bottom: 0.75rem;
        }

        .card-desc {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.68);
          line-height: 1.6;
        }

        /* Creator Reference Section */
        .creator-box {
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 20px;
          padding: 3rem;
          margin-bottom: 3.5rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        }

        .creator-eyebrow {
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          margin-bottom: 0.8rem;
        }

        .creator-title {
          font-family: 'Playfair Display', serif;
          font-size: 2.2rem;
          margin-bottom: 1.2rem;
          color: #ffffff;
        }

        .creator-text {
          color: rgba(255, 255, 255, 0.8);
          font-size: 1.05rem;
          line-height: 1.7;
          margin-bottom: 1.2rem;
          font-weight: 300;
        }

        .creator-text strong {
          color: #ffffff;
          font-weight: 600;
        }

        .creator-social-links {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-top: 1.8rem;
        }

        .creator-social-btn {
          font-family: 'Outfit', sans-serif;
          font-size: 0.92rem;
          font-weight: 500;
          color: #ffffff;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.22);
          padding: 0.65rem 1.4rem;
          border-radius: 9999px;
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          text-decoration: none;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .creator-social-btn:hover {
          background: #ffffff;
          color: #000000;
          border-color: #ffffff;
          transform: translateY(-2px);
        }

        .manifesto-box {
          background: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 20px;
          padding: 2.8rem;
          text-align: center;
        }

        .manifesto-box h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem;
          margin-bottom: 1rem;
        }

        .manifesto-box p {
          color: rgba(255, 255, 255, 0.75);
          font-size: 1.05rem;
          line-height: 1.6;
          max-width: 650px;
          margin: 0 auto 2rem auto;
        }

        .cta-btn {
          font-family: 'Outfit', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          color: #000000;
          background: #ffffff;
          padding: 1rem 2.2rem;
          border-radius: 9999px;
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          text-decoration: none;
          transition: all 0.25s ease;
        }

        .cta-btn:hover {
          background: #e6e6e6;
          transform: translateY(-2px);
        }

        .footer-section {
          position: relative;
          z-index: 5;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.7) 70%, transparent 100%);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          padding: 2rem 0;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .footer-socials {
          display: flex;
          gap: 1.25rem;
          align-items: center;
        }

        .social-icon {
          color: rgba(255, 255, 255, 0.6);
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
        }

        .social-icon:hover {
          color: #ffffff;
          transform: translateY(-2px);
        }

        .footer-copyright {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.5);
        }
      `}</style>

      {/* Background Video */}
      <div className="video-container">
        <video autoPlay muted playsInline loop id="bg-video">
          <source src="/flower.mp4" type="video/mp4" />
          Your browser does not support video.
        </video>
      </div>

      {/* Top Gradient */}
      <img
        src="https://api.getlayers.ai/storage/v1/object/public/public/assets/loopstack-f8c64439bf/black_gradient.svg"
        alt="Top Gradient"
        id="top-gradient"
      />

      {/* Glassy Top Navbar */}
      <header className="glass-navbar">
        <div className="nav-container">
          <Link href="/" className="nav-brand">
            <span className="brand-symbol">◈</span>
            <span className="brand-name">CodeBook</span>
            <span className="free-pill">100% FREE</span>
          </Link>

          <nav className="nav-menu">
            <Link href="/about" className="nav-link active">About</Link>
            <Link href="/docs" className="nav-link">Docs</Link>
          </nav>

          <div className="nav-actions">
            <Link href="/login" className="nav-login">Sign In</Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="about-content">
        <div className="eyebrow">NOTION FOR LEARNING PROGRAMMING</div>
        <h1 className="about-title">Learn Python. Build Your Own Coding Notebook.</h1>
        <p className="lead-text">
          CodeBook is a digital programming notebook designed specifically for learners. Unlike production IDEs or complex software suites, CodeBook provides a clean space to write notes, practice syntax, run real code, and retain your knowledge forever.
        </p>

        {/* Feature Cards */}
        <div className="grid-3">
          <div className="card">
            <div className="card-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            </div>
            <h3 className="card-title">Write &amp; Organize Notes</h3>
            <p className="card-desc">
              Explain concepts in your own words. Group your learnings into topics, subtopics, and structured pages to create a personal reference manual.
            </p>
          </div>

          <div className="card">
            <div className="card-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            </div>
            <h3 className="card-title">Run Real Python 3.11</h3>
            <p className="card-desc">
              Test ideas instantly with executable code blocks powered by NumPy, Pandas, Matplotlib, Polars, OpenCV, and SciPy in a sandboxed runtime.
            </p>
          </div>

          <div className="card">
            <div className="card-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
            </div>
            <h3 className="card-title">Knowledge That Stays With You</h3>
            <p className="card-desc">
              Never re-learn a concept twice. Search through your personal code snippets and markdown notes whenever you need a quick refresher.
            </p>
          </div>
        </div>

        {/* Builder's Reference Section */}
        <section className="creator-box">
          <div className="creator-eyebrow">THE BUILDER'S STORY</div>
          <h2 className="creator-title">How CodeBook Was Built</h2>
          <p className="creator-text">
            CodeBook was designed and built by <strong>Deep Mhatre</strong> out of a personal need for a frictionless learning environment. Traditional IDEs feel heavy and overwhelming when you just want to take notes and test code snippets, while static note apps don't let you run real code.
          </p>
          <p className="creator-text">
            Architected with <strong>Next.js 16</strong>, <strong>Monaco Editor</strong>, a standalone <strong>FastAPI Python 3.11 runner</strong>, <strong>Drizzle ORM</strong>, and <strong>Supabase Auth</strong>, CodeBook bridges the gap between digital notebooks and live execution kernels.
          </p>
          <div className="creator-social-links">
            <a href="https://github.com/Deep-Mhatre" target="_blank" rel="noopener noreferrer" className="creator-social-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
              <span>GitHub</span>
            </a>
            <a href="https://www.linkedin.com/in/deep-mhatre-021b832a9/" target="_blank" rel="noopener noreferrer" className="creator-social-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              <span>LinkedIn</span>
            </a>
            <a href="https://deep-portfolio-eight.vercel.app/" target="_blank" rel="noopener noreferrer" className="creator-social-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
              <span>Portfolio</span>
            </a>
          </div>
        </section>

        {/* Manifesto Box */}
        <div className="manifesto-box">
          <h3>Built for Learning, Not Enterprise Overhead</h3>
          <p>
            Programming is learned concept by concept. CodeBook strips away environment configuration, complex build tools, and unnecessary setup so you can focus on pure understanding and deliberate practice.
          </p>
          <Link href="/notebook" className="cta-btn">
            <span>Start Learning</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </Link>
        </div>
      </main>

      <footer className="footer-section">
        <div className="footer-inner">
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
          <div className="footer-copyright">
            © 2026 CodeBook — Built by Deep Mhatre
          </div>
        </div>
      </footer>
    </div>
  );
}
