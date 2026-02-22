import { useState, useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --ink:#0c0c0e;--paper:#faf9f6;--paper2:#f2efe8;--paper3:#e8e3d8;
    --gold:#c49a2a;--gold-l:#e0b84a;--gold-d:#9a7618;
    --gold-m:rgba(196,154,42,.1);--gold-m2:rgba(196,154,42,.06);
    --muted:#706b62;--muted2:#a09a90;--border:rgba(0,0,0,.07);
    --white:#fff;--green:#2a7a4a;
    --sh:0 2px 20px rgba(0,0,0,.06);--shm:0 8px 40px rgba(0,0,0,.1);
  }
  [data-theme="dark"]{
    --ink:#f0ede6;--paper:#141210;--paper2:#1c1a17;--paper3:#242018;
    --muted:#9a9288;--muted2:#6a6460;--border:rgba(255,255,255,.08);
    --white:#1e1c19;--green:#4aba78;
    --sh:0 2px 20px rgba(0,0,0,.3);--shm:0 8px 40px rgba(0,0,0,.4);
  }
  html{scroll-behavior:smooth}
  body{font-family:'Outfit',sans-serif;background:var(--paper);color:var(--ink);overflow-x:hidden;line-height:1.6;transition:background .3s,color .3s}

  /* NAV */
  nav{position:fixed;top:0;left:0;right:0;z-index:300;height:66px;
    display:flex;align-items:center;justify-content:space-between;padding:0 48px;
    background:rgba(250,249,246,.96);backdrop-filter:blur(20px);
    border-bottom:1px solid var(--border);transition:box-shadow .3s,background .3s}
  [data-theme="dark"] nav{background:rgba(20,18,16,.96)}
  nav.scrolled{box-shadow:var(--sh)}
  .logo{font-family:'DM Mono',monospace;font-size:14px;letter-spacing:.05em;color:var(--ink);text-decoration:none;flex-shrink:0;cursor:pointer;background:none;border:none}
  .logo span{color:var(--gold)}
  .nav-links{display:flex;align-items:stretch;list-style:none;height:66px}
  .nav-links li a{font-size:13px;font-weight:500;color:var(--muted);text-decoration:none;
    padding:0 22px;height:66px;display:flex;align-items:center;
    border-bottom:2.5px solid transparent;border-top:2.5px solid transparent;
    transition:color .2s,background .2s,border-color .2s;white-space:nowrap;cursor:pointer}
  .nav-links li a:hover{color:var(--ink);background:var(--gold-m2)}
  .nav-links li a.active{color:var(--ink);border-bottom-color:var(--gold);background:var(--gold-m2)}
  .theme-toggle{width:38px;height:38px;border-radius:50%;background:none;border:1.5px solid var(--border);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px;transition:all .2s;flex-shrink:0;margin-left:12px;color:var(--ink)}
  .theme-toggle:hover{border-color:var(--gold);background:var(--gold-m)}
  .hamburger{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:4px}
  .hamburger span{display:block;width:22px;height:1.5px;background:var(--ink);border-radius:2px;transition:all .3s}
  .hamburger.open span:nth-child(1){transform:rotate(45deg) translate(4.5px,4.5px)}
  .hamburger.open span:nth-child(2){opacity:0}
  .hamburger.open span:nth-child(3){transform:rotate(-45deg) translate(4.5px,-4.5px)}
  .mob-menu{display:none;position:fixed;inset:0;top:66px;z-index:299;background:var(--paper);
    flex-direction:column;align-items:center;justify-content:center;gap:28px}
  .mob-menu.open{display:flex}
  .mob-menu a{font-size:22px;font-weight:600;color:var(--ink);text-decoration:none;cursor:pointer}

  /* PAGE */
  .page{display:none;min-height:100vh;padding-top:66px}
  .page.active{display:block}

  /* SHARED */
  .sec{padding:80px 48px}
  .inner{max-width:1100px;margin:0 auto;width:100%}
  .cap{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.24em;text-transform:uppercase;color:var(--gold);margin-bottom:16px;display:flex;align-items:center;gap:10px}
  .cap::before{content:'//';opacity:.5}
  .sh{font-family:'Cormorant Garamond',serif;font-size:clamp(28px,5vw,52px);font-weight:700;line-height:1.12;color:var(--ink)}
  .sh em{color:var(--gold);font-style:italic}
  .sub{font-size:15px;font-weight:300;line-height:1.85;color:var(--muted);max-width:520px}
  .r{opacity:0;transform:translateY(20px);transition:opacity .6s ease,transform .6s ease}
  .r.v{opacity:1;transform:none}
  .r.d1{transition-delay:.1s}.r.d2{transition-delay:.2s}.r.d3{transition-delay:.3s}

  /* HOME / HERO */
  .hero{min-height:calc(100vh - 66px);padding:80px 48px;display:flex;flex-direction:column;justify-content:center;position:relative;overflow:hidden}
  .hero-bg{position:absolute;inset:0;background:radial-gradient(ellipse 60% 50% at 75% 20%,rgba(196,154,42,.08),transparent 60%),radial-gradient(ellipse 40% 60% at 5% 85%,rgba(196,154,42,.05),transparent 55%),linear-gradient(180deg,var(--paper) 0%,var(--paper2) 100%)}
  .hero-grain{position:absolute;inset:0;opacity:.025;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");background-size:200px}
  .hero-deco{position:absolute;right:-60px;top:50%;transform:translateY(-50%);font-family:'Cormorant Garamond',serif;font-size:340px;font-weight:700;color:rgba(196,154,42,.04);line-height:1;user-select:none;pointer-events:none}
  .hero-content{position:relative;z-index:1;max-width:700px}
  .hero-h{font-family:'Cormorant Garamond',serif;font-size:clamp(36px,8vw,96px);font-weight:700;line-height:.97;letter-spacing:-.02em;margin-bottom:24px}
  .hero-h em{color:var(--gold);font-style:italic}
  .hero-p{font-size:clamp(14px,3.5vw,17px);font-weight:300;line-height:1.85;color:var(--muted);margin-bottom:48px;max-width:100%}
  .hero-proof{display:flex;align-items:center;gap:20px;padding-top:36px;border-top:1px solid var(--border);max-width:520px}
  .proof-avs{display:flex}
  .proof-av{width:36px;height:36px;border-radius:50%;border:2.5px solid var(--paper);background:var(--gold);margin-left:-10px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;color:#fff}
  .proof-av:first-child{margin-left:0}
  .proof-txt{font-size:13px;color:var(--muted);font-weight:300}
  .proof-txt strong{color:var(--ink);font-weight:600}
  .hero-card{position:absolute;right:52px;top:50%;transform:translateY(-42%);z-index:1;background:var(--white);border:1px solid var(--border);border-radius:12px;padding:24px 28px;box-shadow:var(--shm);min-width:240px;animation:float 4s ease-in-out infinite}
  @keyframes float{0%,100%{transform:translateY(-42%)}50%{transform:translateY(-46%)}}
  .fc-label{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);margin-bottom:10px}
  .fc-title{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:700;color:var(--ink);margin-bottom:14px}
  .fc-row{display:flex;align-items:center;gap:8px;margin-bottom:8px;font-size:12.5px;color:var(--muted)}
  .fc-row::before{content:'✓';color:var(--green);font-weight:700;font-size:13px}
  .fc-row:last-child{margin-bottom:0}
  .fc-badge{margin-top:14px;display:inline-block;background:rgba(42,122,74,.1);color:var(--green);padding:5px 12px;border-radius:100px;font-size:11px;font-weight:600}

  /* WHO */
  .who-strip{background:var(--paper2);padding:80px 48px;border-top:1px solid var(--border)}
  .who-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--border);border:1px solid var(--border);border-radius:4px;overflow:hidden;margin-top:48px}
  .who-card{background:var(--white);padding:36px 32px;transition:background .25s;position:relative;overflow:hidden}
  .who-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--gold);transform:scaleX(0);transform-origin:left;transition:transform .3s}
  .who-card:hover{background:var(--paper)}
  .who-card:hover::before{transform:scaleX(1)}
  .who-icon{font-size:34px;margin-bottom:14px;display:block}
  .who-t{font-family:'Cormorant Garamond',serif;font-size:21px;font-weight:700;color:var(--ink);margin-bottom:10px}
  .who-d{font-size:14px;color:var(--muted);line-height:1.8}
  .who-list{list-style:none;margin-top:12px}
  .who-list li{font-size:13px;color:var(--muted);padding:5px 0;border-bottom:1px solid var(--border);display:flex;align-items:flex-start;gap:8px;line-height:1.5}
  .who-list li::before{content:'→';color:var(--gold);flex-shrink:0}
  .who-list li:last-child{border-bottom:none}

  /* ABOUT */
  .pg-hero{padding:80px 48px 60px;border-bottom:1px solid var(--border)}
  .pg-hero.bg2{background:var(--paper2)}
  .about-grid{display:grid;grid-template-columns:1fr 1.05fr;gap:80px;align-items:start}
  .about-pull{font-family:'Cormorant Garamond',serif;font-size:21px;font-style:italic;line-height:1.6;color:var(--ink);padding-left:22px;border-left:2px solid var(--gold);margin:26px 0 28px}
  .about-p{font-size:15px;font-weight:300;line-height:1.9;color:var(--muted);margin-bottom:16px}
  .cred-list{display:flex;flex-direction:column;gap:1px;border:1px solid var(--border);border-radius:4px;overflow:hidden;margin-top:24px}
  .cred{background:var(--white);padding:16px 20px;display:flex;gap:14px;align-items:flex-start;transition:background .2s}
  .cred:hover{background:var(--gold-m2)}
  .cred-icon{font-size:18px;flex-shrink:0;margin-top:2px}
  .cred-t{font-size:14px;font-weight:600;color:var(--ink);margin-bottom:3px}
  .cred-d{font-size:12.5px;color:var(--muted);line-height:1.6}
  .dark-card{background:var(--ink);border-radius:4px;padding:36px;margin-bottom:18px;position:relative;overflow:hidden}
  .dc-ghost{position:absolute;bottom:-20px;right:-10px;font-family:'Cormorant Garamond',serif;font-size:120px;font-weight:700;color:rgba(196,154,42,.07);line-height:1;user-select:none;pointer-events:none}
  .dc-label{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);margin-bottom:12px}
  .dc-text{font-family:'Cormorant Garamond',serif;font-size:19px;font-style:italic;color:rgba(250,249,246,.82);line-height:1.6;position:relative;z-index:1}
  .mv-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .mv-card{border:1px solid var(--border);border-radius:4px;padding:24px;background:var(--paper2);transition:all .25s}
  .mv-card:hover{border-color:var(--gold);background:var(--gold-m2);transform:translateY(-2px)}
  .mv-icon{font-size:24px;margin-bottom:10px;display:block}
  .mv-t{font-family:'Cormorant Garamond',serif;font-size:19px;font-weight:700;color:var(--ink);margin-bottom:7px}
  .mv-d{font-size:13.5px;color:var(--muted);line-height:1.75}
  .story-band{background:var(--paper3);padding:80px 48px;border-top:1px solid var(--border)}
  .story-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;max-width:1100px;margin:0 auto;align-items:start}
  .timeline{position:relative;padding-left:28px}
  .timeline::before{content:'';position:absolute;left:6px;top:0;bottom:0;width:1.5px;background:var(--border)}
  .tl-item{position:relative;margin-bottom:28px}
  .tl-item:last-child{margin-bottom:0}
  .tl-dot{position:absolute;left:-25px;top:5px;width:10px;height:10px;border-radius:50%;background:var(--gold);border:2px solid var(--paper3)}
  .tl-yr{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.14em;color:var(--gold);margin-bottom:4px}
  .tl-t{font-size:14px;font-weight:600;color:var(--ink);margin-bottom:4px}
  .tl-d{font-size:13px;color:var(--muted);line-height:1.7}

  /* WORK */
  .pw-card{border:1px solid var(--border);border-radius:4px;overflow:hidden;background:var(--white);box-shadow:var(--sh);display:grid;grid-template-columns:400px 1fr;transition:box-shadow .3s,transform .3s;margin-bottom:28px;width:100%}
  .pw-card:last-child{margin-bottom:0}
  .pw-card:hover{box-shadow:var(--shm);transform:translateY(-3px)}
  .pw-card.flip{direction:rtl}
  .pw-card.flip>*{direction:ltr}
  .pw-vis{padding:44px;display:flex;flex-direction:column;justify-content:flex-end;position:relative;overflow:hidden;min-height:380px}
  .pw-vis.fit{background:linear-gradient(150deg,#111 0%,#2a1204 100%)}
  .pw-vis.ops{background:linear-gradient(150deg,#07101f 0%,#142038 100%)}
  .pw-vis-ghost{position:absolute;top:10px;left:10px;font-family:'Cormorant Garamond',serif;font-size:110px;font-weight:700;color:rgba(255,255,255,.04);line-height:1;user-select:none;pointer-events:none}
  .pw-em{font-size:48px;margin-bottom:16px;position:relative;z-index:1}
  .pw-name{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:700;color:#fff;margin-bottom:5px;position:relative;z-index:1}
  .pw-role{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--gold-l);margin-bottom:14px;position:relative;z-index:1}
  .pw-tags{display:flex;flex-wrap:wrap;gap:6px;position:relative;z-index:1}
  .pw-tag{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.5);background:rgba(255,255,255,.06);padding:4px 9px;border:1px solid rgba(255,255,255,.1)}
  .pw-info{padding:44px;display:flex;flex-direction:column;justify-content:center}
  .pw-num{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);margin-bottom:14px}
  .pw-title{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:700;color:var(--ink);margin-bottom:14px}
  .pw-sec{margin-bottom:18px}
  .pw-sec-t{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);margin-bottom:7px}
  .pw-sec-d{font-size:14px;font-weight:300;line-height:1.85;color:var(--muted)}
  .pw-outcomes{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}
  .pw-outcome{background:var(--paper2);border:1px solid var(--border);border-radius:3px;padding:10px 13px}
  .pw-outcome-n{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:700;color:var(--ink);margin-bottom:2px}
  .pw-outcome-l{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted2)}
  .pw-tools{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
  .pw-tool{background:var(--paper3);border:1px solid var(--border);color:var(--muted);font-size:12px;padding:4px 11px;border-radius:100px}
  .pw-link{display:inline-flex;align-items:center;gap:8px;margin-top:20px;font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink);text-decoration:none;border-bottom:1.5px solid var(--ink);padding-bottom:3px;transition:all .2s}
  .pw-link:hover{color:var(--gold);border-color:var(--gold)}

  /* HOW IT WORKS */
  .hiw-inner{max-width:860px;margin:0 auto;padding:80px 48px}
  .hiw-step{display:grid;grid-template-columns:72px 1fr;gap:28px;position:relative}
  .hiw-step::after{content:'';position:absolute;left:34px;top:66px;bottom:-1px;width:1.5px;background:var(--border)}
  .hiw-step:last-child::after{display:none}
  .hiw-step-left{text-align:center;padding-top:2px}
  .hiw-num{font-family:'Cormorant Garamond',serif;font-size:48px;font-weight:700;color:var(--gold);line-height:1;display:block}
  .hiw-icon{font-size:24px;display:block;margin-top:6px}
  .hiw-right{padding-bottom:52px}
  .hiw-t{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:700;color:var(--ink);margin-bottom:10px}
  .hiw-d{font-size:14px;font-weight:300;line-height:1.85;color:var(--muted);margin-bottom:16px}
  .hiw-items{display:flex;flex-direction:column;gap:1px;border:1px solid var(--border);border-radius:4px;overflow:hidden}
  .hiw-item{background:var(--white);padding:12px 18px;display:flex;gap:12px;font-size:13.5px;color:var(--muted);transition:background .2s}
  .hiw-item:hover{background:var(--gold-m2);color:var(--ink)}
  .hiw-item::before{content:'→';color:var(--gold);flex-shrink:0}
  .hiw-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(42,122,74,.08);color:var(--green);padding:7px 14px;border-radius:100px;font-size:12px;font-weight:600;margin-top:12px;border:1px solid rgba(42,122,74,.15)}

  /* CONTACT */
  .contact-wrap{max-width:640px}
  .contact-card{background:var(--ink);border-radius:4px;padding:36px;margin-bottom:18px;position:relative;overflow:hidden}
  .cc-ghost{position:absolute;bottom:-20px;right:-10px;font-family:'Cormorant Garamond',serif;font-size:120px;font-weight:700;color:rgba(196,154,42,.07);line-height:1;pointer-events:none;user-select:none}
  .cc-label{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);margin-bottom:12px}
  .cc-text{font-family:'Cormorant Garamond',serif;font-size:19px;font-style:italic;color:rgba(250,249,246,.82);line-height:1.6;position:relative;z-index:1}
  .contact-details{border:1px solid var(--border);border-radius:4px;overflow:hidden;background:var(--white)}
  .cd-row{padding:20px 22px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:16px;transition:background .2s}
  .cd-row:hover{background:var(--paper2)}
  .cd-row:last-child{border-bottom:none}
  .cd-icon{width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:20px}
  .cd-icon.em{background:rgba(196,154,42,.1)}
  .cd-icon.wa{background:rgba(37,211,102,.1)}
  .cd-icon.ig{background:rgba(225,48,108,.08)}
  .cd-icon.tm{background:rgba(196,154,42,.1)}
  .cd-icon.gl{background:rgba(196,154,42,.08)}
  .cd-label{font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);margin-bottom:3px}
  .cd-val{font-size:14px;font-weight:600;color:var(--ink)}
  .cd-val a{color:inherit;text-decoration:none;transition:color .2s}
  .cd-val a:hover{color:var(--gold)}
  .cd-sub{font-size:12px;color:var(--muted);margin-top:2px}

  /* FOOTER */
  footer{background:var(--paper2);border-top:1px solid var(--border);padding:22px 48px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}
  .footer-logo{font-family:'DM Mono',monospace;font-size:13px;letter-spacing:.05em;color:var(--ink);cursor:pointer;background:none;border:none}
  .footer-logo span{color:var(--gold)}
  .footer-copy{font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.1em;color:var(--muted2)}

  /* RESPONSIVE — TABLET */
  @media(max-width:860px){
    nav{padding:0 20px}
    .nav-links{display:none}
    .hamburger{display:flex}
    .hero{padding:60px 24px 48px;min-height:auto}
    .sec{padding:56px 24px}
    .who-strip,.story-band{padding:56px 24px}
    .hiw-inner{padding:56px 24px}
    .pg-hero{padding:56px 24px 40px}
    .hero-card{display:none}
    .about-grid,.story-grid{grid-template-columns:1fr;gap:36px}
    .pw-card,.pw-card.flip{grid-template-columns:1fr;direction:ltr}
    .pw-vis{min-height:200px;padding:28px}
    .pw-info{padding:28px}
    .mv-grid{grid-template-columns:1fr 1fr}
    .who-grid{grid-template-columns:1fr}
    footer{padding:18px 20px;flex-direction:column;text-align:center;gap:10px}
  }

  /* RESPONSIVE — MOBILE */
  @media(max-width:540px){
    nav{padding:0 16px;height:58px}
    .page{padding-top:58px}
    .mob-menu{top:58px}
    .hero-h{font-size:38px;line-height:1.05}
    .sh{font-size:26px}
    .hero-p{font-size:15px;margin-bottom:32px}
    .sub{font-size:14px}
    .about-pull{font-size:17px}
    .hero{padding:40px 16px 44px}
    .hero-proof{flex-direction:column;align-items:flex-start;gap:12px}
    .sec{padding:44px 16px}
    .who-strip,.story-band{padding:44px 16px}
    .pg-hero{padding:40px 16px 32px}
    .who-card{padding:24px 20px}
    .who-icon{font-size:28px;margin-bottom:10px}
    .about-grid{gap:28px}
    .cred{padding:12px 16px}
    .dark-card{padding:24px 20px}
    .dc-text{font-size:16px}
    .mv-grid{grid-template-columns:1fr}
    .mv-card{padding:18px}
    .story-grid{gap:28px}
    .tl-item{margin-bottom:22px}
    .pw-card{margin-bottom:20px}
    .pw-vis{min-height:180px;padding:20px 24px}
    .pw-em{font-size:36px;margin-bottom:10px}
    .pw-name{font-size:18px}
    .pw-info{padding:24px 20px}
    .pw-title{font-size:19px}
    .pw-outcomes{grid-template-columns:1fr 1fr}
    .pw-sec{margin-bottom:14px}
    .hiw-inner{padding:40px 16px}
    .hiw-step{grid-template-columns:52px 1fr;gap:14px}
    .hiw-step::after{left:24px}
    .hiw-num{font-size:36px}
    .hiw-t{font-size:20px}
    .hiw-right{padding-bottom:36px}
    .hiw-item{font-size:12.5px;padding:10px 14px}
    .contact-wrap{max-width:100%}
    .contact-card{padding:24px 20px}
    .cc-text{font-size:16px}
    .cd-row{padding:16px 16px;gap:12px}
    .cd-icon{width:38px;height:38px;font-size:17px;flex-shrink:0}
    .cd-val{font-size:13px}
    footer{padding:16px}
  }
`;

// ── Scroll reveal hook ──
function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("v"); obs.unobserve(e.target); } }),
      { threshold: 0.07 }
    );
    document.querySelectorAll(".r:not(.v)").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  });
}

// ── Pages ──
function HomePage({ goTo }) {
  useReveal();
  return (
    <div className="page active" id="page-home">
      <div className="hero">
        <div className="hero-bg" />
        <div className="hero-grain" />
        <div className="hero-deco">E</div>
        <div className="hero-content">
          <h1 className="hero-h r">Build a Professional<br /><em>E-Portfolio</em><br />That Gets You Hired.</h1>
          <p className="hero-p r d1">We design and deploy stunning personal portfolio websites for students, graduates, and professionals — so you walk into every opportunity with an unforgettable first impression.</p>
          <div className="hero-proof r d2">
            <div className="proof-avs">
              <div className="proof-av">K</div>
              <div className="proof-av" style={{ background: "#9a7618" }}>M</div>
              <div className="proof-av" style={{ background: "#2a7a4a" }}>A</div>
            </div>
            <div className="proof-txt">Trusted by <strong>graduates &amp; professionals</strong> across the UK and UAE</div>
          </div>
        </div>
        <div className="hero-card r d2">
          <div className="fc-label">What You Get</div>
          <div className="fc-title">Your Live Portfolio</div>
          <div className="fc-row">Custom React design</div>
          <div className="fc-row">Deployed on Vercel</div>
          <div className="fc-row">Mobile &amp; SEO optimized</div>
          <div className="fc-row">Dark / Light mode</div>
          <div className="fc-row">Ready in 7–14 days</div>
          <div className="fc-badge">✓ Shareable live link</div>
        </div>
      </div>
      <div className="who-strip">
        <div className="inner">
          <div className="cap r">Who It's For</div>
          <h2 className="sh r d1">Built for the people who<br /><em>deserve to stand out.</em></h2>
          <div className="who-grid">
            {[
              { icon: "🎓", title: "University Students", desc: "You're building your future. A portfolio gives you something concrete to show employers before your career even starts.", items: ["Showcase projects & coursework", "Stand out for internships", "Build credibility from day one", "Complement your LinkedIn profile"] },
              { icon: "💼", title: "Internship Seekers", desc: "Competition is fierce. An e-portfolio turns your applications from a PDF into a living showcase of your potential.", items: ["Replace a generic CV with proof", "Show initiative and ambition", "Make recruiters remember you", "Include a direct CV download button"] },
              { icon: "🚀", title: "Fresh Graduates", desc: "You've worked hard for your degree. Now make sure employers see exactly what you're capable of — instantly.", items: ["Present your degree & projects", "Target international job markets", "Professional branding from day one", "Compete globally, not just locally"] },
            ].map((c, i) => (
              <div key={i} className={`who-card r d${i + 1}`}>
                <span className="who-icon">{c.icon}</span>
                <div className="who-t">{c.title}</div>
                <p className="who-d">{c.desc}</p>
                <ul className="who-list">{c.items.map((item, j) => <li key={j}>{item}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AboutPage() {
  useReveal();
  return (
    <div className="page active" id="page-about">
      <div className="pg-hero bg2">
        <div style={{ maxWidth: 800 }}>
          <div className="cap r">About Us</div>
          <h1 className="sh r d1">Built by someone who's been <em>there.</em></h1>
          <p className="sub r d2" style={{ marginTop: 14 }}>The.E.Portfolio was born from a simple realization: talented students are being overlooked not because of their ability, but because of how they present themselves.</p>
        </div>
      </div>
      <div className="sec">
        <div className="inner about-grid">
          <div>
            <div className="cap r">Who We Are</div>
            <h2 className="sh r d1" style={{ marginBottom: 18 }}>We understand the job market because we've <em>lived it.</em></h2>
            <blockquote className="about-pull r d2">"I graduated with a Master's degree and realized I was competing against hundreds of people with the same qualifications. I needed something that set me apart."</blockquote>
            <p className="about-p r d2">The.E.Portfolio was founded by a Master's graduate who experienced firsthand how difficult the modern job market is — especially as an international student entering a new country's workforce.</p>
            <p className="about-p r d3">Armed with an MSc in Management and a deep understanding of how recruitment works, we built a studio focused on helping students and graduates present themselves with the same professionalism as senior professionals.</p>
            <p className="about-p r d3">We know what hiring managers look for. We know how recruiters think. And we know how to build portfolios that make you impossible to ignore.</p>
            <div className="cred-list r d3">
              {[
                { icon: "🎓", title: "MSc in Management", desc: "Deep understanding of business, operations, and how organizations hire — applied to every portfolio we build." },
                { icon: "🌍", title: "International Job Market Experience", desc: "Personal experience navigating UK, UAE, and Indian job markets — we know what works across borders." },
                { icon: "⚛️", title: "React & Modern Web Development", desc: "Every portfolio is custom-built in React, deployed on Vercel — not WordPress, not a website builder." },
              ].map((c, i) => (
                <div key={i} className="cred">
                  <div className="cred-icon">{c.icon}</div>
                  <div><div className="cred-t">{c.title}</div><div className="cred-d">{c.desc}</div></div>
                </div>
              ))}
            </div>
          </div>
          <div className="r d2">
            <div className="dark-card" style={{ marginBottom: 18 }}>
              <div className="dc-ghost">E</div>
              <div className="dc-label">Our Promise</div>
              <div className="dc-text">"We don't build generic websites. We build the version of you that gets the interview — and earns the offer."</div>
            </div>
            <div className="cap" style={{ marginBottom: 14 }}>Mission &amp; Vision</div>
            <div className="mv-grid">
              <div className="mv-card"><span className="mv-icon">🎯</span><div className="mv-t">Our Mission</div><div className="mv-d">To help students and graduates compete globally through strong personal branding — giving everyone access to professional presentation.</div></div>
              <div className="mv-card"><span className="mv-icon">🔭</span><div className="mv-t">Our Vision</div><div className="mv-d">To make e-portfolios a standard part of every job application — replacing the outdated 1-page CV with a living showcase.</div></div>
            </div>
          </div>
        </div>
      </div>
      <div className="story-band">
        <div className="story-grid">
          <div>
            <div className="cap r">Why We Started</div>
            <h2 className="sh r d1">The moment everything became <em>clear.</em></h2>
            <p className="sub r d2" style={{ marginTop: 14 }}>It started with rejection — and ended with a realization that changed everything.</p>
          </div>
          <div className="timeline r d2">
            {[
              { yr: "The Problem", title: "Same degree, different outcomes", desc: "Graduating alongside hundreds of other MSc students, it was clear that qualifications alone don't decide who gets hired. Presentation does." },
              { yr: "The Realization", title: "A portfolio changed the conversation", desc: "Building a personal portfolio site led to better responses, more callbacks, and interviews that opened with \"I loved your portfolio\" instead of \"I glanced at your CV.\"" },
              { yr: "The Action", title: "Students shouldn't have to figure this out alone", desc: "Most students don't know how to build a portfolio, don't have the technical skills, and don't know what recruiters want to see. We do — and we built a studio to fix that." },
              { yr: "Today", title: "The.E.Portfolio is launched", desc: "A boutique studio helping students, interns, and graduates across the UK, UAE, and India present themselves like seasoned professionals." },
            ].map((t, i) => (
              <div key={i} className="tl-item">
                <div className="tl-dot" />
                <div className="tl-yr">{t.yr}</div>
                <div className="tl-t">{t.title}</div>
                <div className="tl-d">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkPage() {
  useReveal();
  return (
    <div className="page active" id="page-work">
      <div className="pg-hero bg2">
        <div style={{ maxWidth: 800 }}>
          <div className="cap r">Our Work</div>
          <h1 className="sh r d1">Real portfolios.<br />Real <em>results.</em></h1>
          <p className="sub r d2" style={{ marginTop: 14 }}>Every portfolio we build is unique — custom-designed from scratch to match the professional's career, personality, and target market.</p>
        </div>
      </div>
      <div className="sec">
        <div className="inner">
          {/* Kartik — Project 01 */}
          <div className="pw-card r">
            <div className="pw-vis ops">
              <div className="pw-vis-ghost">KH</div>
              <div className="pw-em">💼</div>
              <div className="pw-name">Kartik Hushare</div>
              <div className="pw-role">Business Process &amp; Systems Analyst · UAE</div>
              <div className="pw-tags">
                <span className="pw-tag">ERP</span><span className="pw-tag">Power BI</span><span className="pw-tag">Operations</span><span className="pw-tag">DAX</span><span className="pw-tag">React</span>
              </div>
            </div>
            <div className="pw-info">
              <div className="pw-num">Project № 01 · Operations &amp; Technology</div>
              <div className="pw-title">Operations &amp; Systems Analyst Portfolio</div>
              <div className="pw-sec"><div className="pw-sec-t">The Problem</div><div className="pw-sec-d">Kartik had delivered extraordinary results — cutting ERP order processing from 8 minutes to under 15 seconds, reducing weekly reconciliations from 132 to 35. None of it was visible on a standard CV.</div></div>
              <div className="pw-sec"><div className="pw-sec-t">The Solution</div><div className="pw-sec-d">A data-driven portfolio with a smart welcome modal — giving recruiters a curated quick-view, while full visitors get the entire interactive experience with five detailed case studies.</div></div>
              <div className="pw-sec"><div className="pw-sec-t">Tools Used</div><div className="pw-tools"><span className="pw-tool">React</span><span className="pw-tool">Custom CSS</span><span className="pw-tool">Google Analytics 4</span><span className="pw-tool">Vercel</span><span className="pw-tool">Recruiter Modal</span></div></div>
              <div className="pw-sec"><div className="pw-sec-t">Outcome</div>
                <div className="pw-outcomes">
                  <div className="pw-outcome"><div className="pw-outcome-n">30×</div><div className="pw-outcome-l">ERP Speed Improvement</div></div>
                  <div className="pw-outcome"><div className="pw-outcome-n">5</div><div className="pw-outcome-l">Case Studies Live</div></div>
                  <div className="pw-outcome"><div className="pw-outcome-n">2</div><div className="pw-outcome-l">View Modes</div></div>
                  <div className="pw-outcome"><div className="pw-outcome-n">GA4</div><div className="pw-outcome-l">Analytics Integrated</div></div>
                </div>
              </div>
              <a className="pw-link" href="https://kartikhushare.vercel.app" target="_blank" rel="noopener noreferrer">View Live Portfolio →</a>
            </div>
          </div>

          {/* Kunalsingh — Project 02 */}
          <div className="pw-card flip r d1">
            <div className="pw-info">
              <div className="pw-num">Project № 02 · Fitness &amp; Wellness</div>
              <div className="pw-title">Fitness Coach Portfolio</div>
              <div className="pw-sec"><div className="pw-sec-t">The Problem</div><div className="pw-sec-d">Kunalsingh had 7+ years of coaching experience across top UK gyms — The Gym Group, JD Gyms — plus 9 international certifications. But recruiters were seeing a plain CV instead of the full story.</div></div>
              <div className="pw-sec"><div className="pw-sec-t">The Solution</div><div className="pw-sec-d">A fully animated dark/light mode portfolio featuring an interactive experience timeline, expandable certification panels, animated skill bars, and social sharing.</div></div>
              <div className="pw-sec"><div className="pw-sec-t">Tools Used</div><div className="pw-tools"><span className="pw-tool">React</span><span className="pw-tool">Custom CSS</span><span className="pw-tool">Vercel</span><span className="pw-tool">SEO</span><span className="pw-tool">Dark/Light Mode</span><span className="pw-tool">Animations</span></div></div>
              <div className="pw-sec"><div className="pw-sec-t">Outcome</div>
                <div className="pw-outcomes">
                  <div className="pw-outcome"><div className="pw-outcome-n">9</div><div className="pw-outcome-l">Certifications Showcased</div></div>
                  <div className="pw-outcome"><div className="pw-outcome-n">5</div><div className="pw-outcome-l">Roles Documented</div></div>
                  <div className="pw-outcome"><div className="pw-outcome-n">7+yrs</div><div className="pw-outcome-l">Career Story Told</div></div>
                  <div className="pw-outcome"><div className="pw-outcome-n">Live</div><div className="pw-outcome-l">Deployed on Vercel</div></div>
                </div>
              </div>
              <a className="pw-link" href="https://kunalsingh-hushare.vercel.app" target="_blank" rel="noopener noreferrer">View Live Portfolio →</a>
            </div>
            <div className="pw-vis fit">
              <div className="pw-vis-ghost">KH</div>
              <div className="pw-em">💪</div>
              <div className="pw-name">Kunalsingh Hushare</div>
              <div className="pw-role">Certified Fitness Coach · Manchester, UK</div>
              <div className="pw-tags">
                <span className="pw-tag">HIIT</span><span className="pw-tag">CrossFit</span><span className="pw-tag">Hyrox</span><span className="pw-tag">Nutrition</span><span className="pw-tag">React</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HowPage() {
  useReveal();
  const steps = [
    { num: "01", icon: "📋", title: "Submit Your Information", desc: "You share everything we need to tell your story properly. The more detail you provide, the more powerful your portfolio will be.", items: ["Your up-to-date CV or resume", "Details of your projects, achievements & outcomes", "Your LinkedIn profile URL", "Career goals and target roles", "Target country or region (UK, UAE, India, etc.)", "Any certifications, degrees, or courses"], badge: "⏱ Takes you 20–30 minutes to complete" },
    { num: "02", icon: "🗺️", title: "Strategy Planning", desc: "Before a single line of code is written, we plan the full structure — what to highlight, how to frame your story, and what visual direction works best.", items: ["Site structure — pages, sections, and flow", "Content refinement — sharpen descriptions and impact statements", "Branding theme — colors, fonts, layout direction", "Tailor messaging for your target country and role type"], badge: "⏱ Strategy delivered within 48 hours" },
    { num: "03", icon: "⚙️", title: "Design & Development", desc: "Built from scratch in React — no templates, no website builders. Every animation, layout, and interaction is intentional and unique to you.", items: ["Fully custom React development — zero templates", "Responsive design — flawless on mobile, tablet & desktop", "Dark / Light mode toggle built in as standard", "Downloadable CV / Resume button", "Google Analytics 4 integration for visitor tracking", "SEO-optimized — Open Graph, Twitter cards, meta tags"], badge: "⏱ Build completed in 5–10 days" },
    { num: "04", icon: "🚀", title: "Review & Launch", desc: "You review your portfolio in full. We refine until you're completely happy — then deploy and hand over your live link.", items: ["Private preview link shared with you for review", "Up to 2 rounds of revision included", "Final QA across mobile, tablet & desktop", "Deployed live on Vercel with global CDN", "Shareable live URL ready for your CV & LinkedIn"], badge: "✓ Live in 7–14 days total" },
  ];
  return (
    <div className="page active" id="page-how">
      <div className="pg-hero bg2">
        <div style={{ maxWidth: 720 }}>
          <div className="cap r">How It Works</div>
          <h1 className="sh r d1">Four steps from your details to a <em>live portfolio.</em></h1>
          <p className="sub r d2" style={{ marginTop: 14 }}>Simple, guided process — we handle everything while you focus on your career.</p>
        </div>
      </div>
      <div className="hiw-inner">
        {steps.map((s, i) => (
          <div key={i} className={`hiw-step r d${i}`}>
            <div className="hiw-step-left"><span className="hiw-num">{s.num}</span><span className="hiw-icon">{s.icon}</span></div>
            <div className="hiw-right">
              <div className="hiw-t">{s.title}</div>
              <p className="hiw-d">{s.desc}</p>
              <div className="hiw-items">{s.items.map((item, j) => <div key={j} className="hiw-item">{item}</div>)}</div>
              <div className="hiw-badge">{s.badge}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactPage() {
  useReveal();
  return (
    <div className="page active" id="page-contact">
      <div className="pg-hero bg2">
        <div style={{ maxWidth: 720 }}>
          <div className="cap r">Contact</div>
          <h1 className="sh r d1">Let's build something you're <em>proud of.</em></h1>
          <p className="sub r d2" style={{ marginTop: 14 }}>Reach out directly — we're always happy to chat about your portfolio and how we can help you stand out.</p>
        </div>
      </div>
      <div className="sec">
        <div className="inner">
          <div className="contact-wrap r">
            <div className="contact-card">
              <div className="cc-ghost">E</div>
              <div className="cc-label">Reach Us Directly</div>
              <div className="cc-text">"Whether you have a question or you're ready to start — drop us a message on any of these channels and we'll get back to you fast."</div>
            </div>
            <div className="contact-details">
              <div className="cd-row"><div className="cd-icon em">📧</div><div><div className="cd-label">Email</div><div className="cd-val"><a href="mailto:the.e.portfolioe@gmail.com">the.e.portfolioe@gmail.com</a></div><div className="cd-sub">We reply within 24 hours, Mon–Sat</div></div></div>
              <div className="cd-row"><div className="cd-icon wa">💬</div><div><div className="cd-label">WhatsApp</div><div className="cd-val"><a href="https://wa.me/971547315499" target="_blank" rel="noopener noreferrer">+971 54 731 5499</a></div><div className="cd-sub">Quick questions? Message us directly</div></div></div>
              <div className="cd-row"><div className="cd-icon ig">📸</div><div><div className="cd-label">Instagram</div><div className="cd-val"><a href="https://www.instagram.com/the.e.portfolio?igsh=MWJybTVscnplOTh4eQ%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer">@the.e.portfolio</a></div><div className="cd-sub">Follow us for portfolio inspiration &amp; updates</div></div></div>
              <div className="cd-row"><div className="cd-icon tm">⏱</div><div><div className="cd-label">Turnaround Time</div><div className="cd-val">7–14 Days</div><div className="cd-sub">From your submission to a live portfolio URL</div></div></div>
              <div className="cd-row"><div className="cd-icon gl">🌍</div><div><div className="cd-label">Markets We Serve</div><div className="cd-val">Worldwide 🌍</div><div className="cd-sub">We work with clients across all countries &amp; industries</div></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main App ──
export default function TheEPortfolio() {
  const [page, setPage] = useState("home");
  const [dark, setDark] = useState(false);
  const [mobOpen, setMobOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setMobOpen(false);
  }, [page]);

  const goTo = (p) => { setPage(p); setMobOpen(false); };

  const pages = { home: <HomePage goTo={goTo} />, about: <AboutPage />, work: <WorkPage />, how: <HowPage />, contact: <ContactPage /> };

  return (
    <>
      <style>{styles}</style>

      {/* NAV */}
      <nav className={scrolled ? "scrolled" : ""}>
        <button className="logo" onClick={() => goTo("home")}>The<span>.</span>E<span>.</span>Portfolio</button>
        <ul className="nav-links">
          {["about", "work", "how", "contact"].map((p) => (
            <li key={p}><a className={page === p ? "active" : ""} onClick={() => goTo(p)}>
              {p === "about" ? "About Us" : p === "work" ? "Our Work" : p === "how" ? "How It Works" : "Contact"}
            </a></li>
          ))}
        </ul>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button className="theme-toggle" onClick={() => setDark(!dark)} aria-label="Toggle theme">{dark ? "🌙" : "☀️"}</button>
          <button className={`hamburger ${mobOpen ? "open" : ""}`} onClick={() => setMobOpen(!mobOpen)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mob-menu ${mobOpen ? "open" : ""}`}>
        {["home", "about", "work", "how", "contact"].map((p) => (
          <a key={p} onClick={() => goTo(p)}>
            {p === "home" ? "Home" : p === "about" ? "About Us" : p === "work" ? "Our Work" : p === "how" ? "How It Works" : "Contact"}
          </a>
        ))}
      </div>

      {/* PAGE */}
      {pages[page]}

      {/* FOOTER */}
      <footer>
        <button className="footer-logo" onClick={() => goTo("home")}>The<span>.</span>E<span>.</span>Portfolio</button>
        <span className="footer-copy">© 2025 The.E.Portfolio</span>
      </footer>
    </>
  );
}
