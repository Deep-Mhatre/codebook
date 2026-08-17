'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function DocsPage() {
  useEffect(() => {
    const bgVideo = document.getElementById('bg-video') as HTMLVideoElement | null;
    if (bgVideo) {
      bgVideo.muted = true;
      bgVideo.play().catch((err) => console.warn('Video autoplay policy override:', err));
    }
  }, []);

  return (
    <div className="docs-container">
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

        .docs-layout {
          position: relative;
          z-index: 5;
          max-width: 1150px;
          margin: 0 auto;
          padding: 130px 2rem 100px 2rem;
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 3rem;
        }

        .docs-sidebar {
          position: sticky;
          top: 110px;
          height: fit-content;
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          padding: 1.5rem;
        }

        .sidebar-title {
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          margin-bottom: 1rem;
        }

        .sidebar-links {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .sidebar-link {
          font-size: 0.92rem;
          color: rgba(255, 255, 255, 0.65);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .sidebar-link:hover {
          color: #ffffff;
        }

        .docs-body {
          max-width: 780px;
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 20px;
          padding: 2.5rem 3rem;
        }

        .docs-eyebrow {
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          margin-bottom: 0.8rem;
        }

        .docs-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 3rem;
          font-weight: 400;
          margin-bottom: 1.5rem;
          line-height: 1.15;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
        }

        .docs-intro {
          font-size: 1.12rem;
          color: rgba(255, 255, 255, 0.75);
          line-height: 1.7;
          margin-bottom: 3rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 2rem;
        }

        .doc-section {
          margin-bottom: 3.5rem;
        }

        .section-heading {
          font-size: 1.5rem;
          font-weight: 500;
          margin-bottom: 1rem;
          color: #ffffff;
        }

        .section-text {
          font-size: 0.98rem;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.7;
          margin-bottom: 1.2rem;
        }

        .code-snippet {
          background: rgba(0, 0, 0, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          padding: 1.2rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.88rem;
          color: #e6e6e6;
          margin-bottom: 1.2rem;
          overflow-x: auto;
        }

        .shortcut-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
        }

        .shortcut-table th, .shortcut-table td {
          padding: 0.85rem 1rem;
          text-align: left;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 0.95rem;
        }

        .shortcut-table th {
          color: rgba(255, 255, 255, 0.5);
          font-weight: 500;
        }

        .kbd {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          padding: 0.2rem 0.5rem;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.82rem;
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
            <Link href="/about" className="nav-link">About</Link>
            <Link href="/docs" className="nav-link active">Docs</Link>
          </nav>

          <div className="nav-actions">
            <Link href="/login" className="nav-login">Sign In</Link>
          </div>
        </div>
      </header>

      {/* Docs Layout */}
      <div className="docs-layout">
        <aside className="docs-sidebar">
          <div className="sidebar-title">Getting Started</div>
          <div className="sidebar-links">
            <a href="#overview" className="sidebar-link">Overview</a>
            <a href="#notebook-structure" className="sidebar-link">Notebook Structure</a>
            <a href="#writing-notes" className="sidebar-link">Writing Notes</a>
            <a href="#running-python" className="sidebar-link">Running Python</a>
            <a href="#shortcuts" className="sidebar-link">Shortcuts</a>
            <a href="#roadmap" className="sidebar-link">Future Enhancements</a>
          </div>
        </aside>

        <main className="docs-body">
          <div className="docs-eyebrow">DOCUMENTATION</div>
          <h1 className="docs-title">CodeBook User Manual</h1>
          <p className="docs-intro">
            Welcome to CodeBook documentation. Learn how to write structured notes, run executable Python code blocks, track session workspace files, and organize your programming knowledge base.
          </p>

          <section id="overview" className="doc-section">
            <h2 className="section-heading">1. Overview</h2>
            <p className="section-text">
              CodeBook combines the structured note-taking experience of Notion with an interactive Python execution kernel. Every document in CodeBook consists of modular blocks: Markdown text blocks for your explanations and Monaco Code blocks for your Python code.
            </p>
          </section>

          <section id="notebook-structure" className="doc-section">
            <h2 className="section-heading">2. Notebook Structure</h2>
            <p className="section-text">
              CodeBook uses a three-tier hierarchy to keep your learning organized:
            </p>
            <ul style={{ paddingLeft: '1.5rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.8' }}>
              <li><strong>Notebooks:</strong> High-level subjects (e.g. <em>Python Fundamentals</em>, <em>Data Analysis</em>).</li>
              <li><strong>Topics:</strong> Specific modules or units (e.g. <em>Control Flow</em>, <em>Pandas DataFrames</em>).</li>
              <li><strong>Pages:</strong> Individual lesson pages containing your notes and executable code blocks.</li>
            </ul>
          </section>

          <section id="running-python" className="doc-section">
            <h2 className="section-heading">3. Running Python Code</h2>
            <p className="section-text">
              Code blocks support Python 3.11 with automatic stdout formatting, error tracebacks, and rich outputs.
            </p>
            <div className="code-snippet">
              {`import pandas as pd
import matplotlib.pyplot as plt

df = pd.DataFrame({'Concept': ['Variables', 'Loops', 'Functions'], 'Mastery': [90, 85, 95]})
print("Summary of Learning Progress:")
print(df)`}
            </div>
            <p className="section-text">
              Press <span className="kbd">⌘ + Enter</span> or click the <strong>▶ Run</strong> button on any code block to execute it immediately.
            </p>
          </section>

          <section id="shortcuts" className="doc-section">
            <h2 className="section-heading">4. Keyboard Shortcuts</h2>
            <table className="shortcut-table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Shortcut</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Execute Code Block</td>
                  <td><span className="kbd">⌘ + Enter</span> / <span className="kbd">Ctrl + Enter</span></td>
                </tr>
                <tr>
                  <td>Save Page Changes</td>
                  <td><span className="kbd">⌘ + S</span> / <span className="kbd">Ctrl + S</span></td>
                </tr>
                <tr>
                  <td>Global Search</td>
                  <td><span className="kbd">⌘ + K</span> / <span className="kbd">Ctrl + K</span></td>
                </tr>
              </tbody>
            </table>
          </section>

          <section id="roadmap" className="doc-section">
            <h2 className="section-heading" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span>5. Future Enhancements</span>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                color: '#f59e0b',
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '0.2rem 0.6rem',
                borderRadius: '9999px',
                textTransform: 'uppercase'
              }}>
                Coming Soon
              </span>
            </h2>
            <p className="section-text">
              We are actively expanding CodeBook capabilities. The following features are designated as future enhancements and will be updated soon in upcoming releases:
            </p>
            <div style={{
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: '12px',
              padding: '1.2rem 1.5rem',
              color: 'rgba(255, 255, 255, 0.85)',
              fontSize: '0.92rem',
              lineHeight: '1.7'
            }}>
              <div style={{ fontWeight: 600, color: '#fbbf24', marginBottom: '0.4rem', fontSize: '0.98rem' }}>
                📷 Computer Vision & Real-Time Camera AI (Under Development)
              </div>
              <p style={{ color: 'rgba(255, 255, 255, 0.75)' }}>
                Built-in Computer Vision tasks (<code style={{ color: '#fef08a' }}>codebook.vision</code>), live webcam streaming overlays, MediaPipe hand & face landmark detection, and zero-config ML model inference are currently designated for a future feature release. Detailed API documentation and interactive vision blocks will be updated soon!
              </p>
            </div>
          </section>
        </main>
      </div>

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
