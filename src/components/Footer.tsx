import React from "react";

// SVGs for each marketplace logo (adjusted for no overlap)
const bigbasketLogo = (
  <svg width="140" height="40" viewBox="0 0 140 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="140" height="40" rx="8" fill="#fff"/>
    <g transform="translate(8,6)">
      <rect width="28" height="28" rx="4" fill="#8CC63F"/>
      <text x="14" y="20" fontSize="16" fontWeight="bold" fill="#D8232A" textAnchor="middle" fontFamily="Arial">b</text>
      <text x="22" y="20" fontSize="16" fontWeight="bold" fill="#222" textAnchor="middle" fontFamily="Arial">b</text>
    </g>
    <text x="44" y="26" fontSize="20" fontWeight="bold" fill="#222" fontFamily="Arial">big</text>
    <text x="75" y="26" fontSize="20" fontWeight="bold" fill="#222" fontFamily="Arial">basket</text>
  </svg>
);

const zeptoLogo = (
  <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="60" y="28" fontSize="28" fontWeight="bold" fill="#FF4C6B" textAnchor="middle" fontFamily="Arial">zepto</text>
  </svg>
);

const amazonLogo = (
  <svg width="140" height="40" viewBox="0 0 140 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="70" y="26" fontSize="28" fontWeight="bold" fill="#000" textAnchor="middle" fontFamily="Arial">amazon</text>
    <path d="M30 32 Q70 36 110 32" stroke="#FF9900" strokeWidth="2" fill="none"/>
    <circle cx="105" cy="32" r="2" fill="#FF9900"/>
  </svg>
);

const swiggyLogo = (
  <svg width="140" height="40" viewBox="0 0 140 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g>
      <text x="70" y="18" fontSize="16" fontWeight="bold" fill="#FC8019" textAnchor="middle" fontFamily="Arial">swiggy</text>
      <text x="70" y="34" fontSize="16" fontWeight="bold" fill="#FC8019" textAnchor="middle" fontFamily="Arial">instamart</text>
    </g>
  </svg>
);

const flipkartLogo = (
  <svg width="130" height="40" viewBox="0 0 130 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="10" y="26" fontSize="24" fontWeight="bold" fill="#2874F0" textAnchor="start" fontFamily="Arial">Flipkart</text>
    <rect x="108" y="12" width="16" height="16" rx="3" fill="#FFD600"/>
    <text x="116" y="23" fontSize="12" fontWeight="bold" fill="#2874F0" textAnchor="middle" fontFamily="Arial">f</text>
  </svg>
);

const blinkitLogo = (
  <svg width="105" height="40" viewBox="0 0 105 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="10" y="26" fontSize="24" fontWeight="bold" fill="#1BA94C" textAnchor="start" fontFamily="Arial">blink</text>
    <text x="65" y="26" fontSize="24" fontWeight="bold" fill="#222" textAnchor="start" fontFamily="Arial">it</text>
  </svg>
);

const meeshoLogo = (
  <svg width="130" height="40" viewBox="0 0 130 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="10" y="26" fontSize="24" fontWeight="bold" fill="#FF3399" textAnchor="start" fontFamily="Arial">Meesho</text>
  </svg>
);

const socialIcons = [
  { name: "Instagram", href: "#", svg: <svg width="48" height="48" fill="none" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="none"/><path d="M22 10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h8zm-4 2.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm5.5-.5a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1z" stroke="#fff" strokeWidth="2"/></svg> },
  { name: "Facebook", href: "#", svg: <svg width="48" height="48" fill="none" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="none"/><path d="M20 11h-2a2 2 0 0 0-2 2v2h-2v3h2v7h3v-7h2.1l.4-3H19v-1a.5.5 0 0 1 .5-.5H20v-3z" stroke="#fff" strokeWidth="2"/></svg> },
  { name: "YouTube", href: "#", svg: <svg width="48" height="48" fill="none" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="none"/><path d="M22 16.5l-8 4.5v-9l8 4.5z" fill="#fff"/></svg> },
];

const Footer = () => (
  <footer className="mt-16">
    {/* Marketplace Row */}
    <div className="w-full bg-[#F7D37D] py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* First row with 5 logos */}
        <div className="flex flex-wrap justify-center items-center gap-8 mb-4">
          <div className="flex items-center justify-center">{bigbasketLogo}</div>
          <div className="flex items-center justify-center">{zeptoLogo}</div>
          <div className="flex items-center justify-center">{amazonLogo}</div>
          <div className="flex items-center justify-center">{swiggyLogo}</div>
          <div className="flex items-center justify-center">{blinkitLogo}</div>
        </div>
        {/* Second row with Flipkart centered */}
        <div className="flex justify-center gap-8">
          <div className="flex items-center justify-center">{flipkartLogo}</div>
          <div className="flex items-center justify-center">{meeshoLogo}</div>
        </div>
      </div>
    </div>
    
    {/* Info Row */}
    <div className="w-full bg-[#7BA16D] py-12 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:justify-between md:items-start gap-10">
        {/* Brand */}
        <div className="flex-1 flex flex-col items-center md:items-start mb-8 md:mb-0">
          <span className="text-white text-4xl font-bold mb-2" style={{ fontFamily: 'cursive' }}>Bon Appetite</span>
          <div className="mt-4 text-center md:text-left">
            <p className="text-white text-sm leading-relaxed">
              Authentic, handmade pasta (uncooked) &nbsp;|&nbsp; Where every bite tells a story &nbsp;|&nbsp; Taste the Italian tradition &nbsp;|<br/>
              Delivering Pasta India-wide<br/>
              <span className="font-bold">Order&nbsp;on&nbsp;9390105767</span>
            </p>
          </div>
        </div>
        {/* Policies & Explore */}
        <div className="flex-1 flex flex-row justify-center gap-20">
          <div>
            <div className="text-white text-lg font-semibold mb-4 tracking-widest">POLICIES</div>
            <ul className="space-y-2">
              <li><a href="#" className="text-white font-bold hover:underline">Return Policy</a></li>
              <li><a href="#" className="text-white font-bold hover:underline">Privacy Policy</a></li>
              <li><a href="#" className="text-white font-bold hover:underline">Sitemap</a></li>
            </ul>
          </div>
          <div>
            <div className="text-white text-lg font-semibold mb-4 tracking-widest">EXPLORE</div>
            <ul className="space-y-2">
              <li><a href="#" className="text-white font-bold hover:underline">FAQ</a></li>
              <li><a href="#" className="text-white font-bold hover:underline">Blogs</a></li>
              <li><a href="#" className="text-white font-bold hover:underline">About Us</a></li>
              <li><a href="#" className="text-white font-bold hover:underline">Terms & Conditions</a></li>
            </ul>
          </div>
        </div>
        {/* Social Icons */}
        <div className="flex-1 flex flex-row justify-center md:justify-end items-center gap-4 mt-8 md:mt-0">
          {socialIcons.map((icon, i) => (
            <a key={i} href={icon.href} aria-label={icon.name} className="hover:opacity-80">{icon.svg}</a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

// SimpleFooter: Only Info Row, no logos
const SimpleFooter = () => (
  <footer className="mt-16">
    <div className="w-full bg-[#7BA16D] py-12 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:justify-between md:items-start gap-10">
        {/* Brand */}
        <div className="flex-1 flex flex-col items-center md:items-start mb-8 md:mb-0">
          <span className="text-white text-4xl font-bold mb-2" style={{ fontFamily: 'cursive' }}>Bon Appetite</span>
          <div className="mt-4 text-center md:text-left">
            <p className="text-white text-sm leading-relaxed">
              Authentic, handmade pasta (uncooked) &nbsp;|&nbsp; Where every bite tells a story &nbsp;|&nbsp; Taste the Italian tradition &nbsp;|<br/>
              Delivering Pasta India-wide<br/>
              <span className="font-bold">Order&nbsp;on&nbsp;9390105767</span>
            </p>
          </div>
        </div>
        {/* Policies & Explore */}
        <div className="flex-1 flex flex-row justify-center gap-20">
          <div>
            <div className="text-white text-lg font-semibold mb-4 tracking-widest">POLICIES</div>
            <ul className="space-y-2">
              <li><a href="#" className="text-white font-bold hover:underline">Return Policy</a></li>
              <li><a href="#" className="text-white font-bold hover:underline">Privacy Policy</a></li>
              <li><a href="#" className="text-white font-bold hover:underline">Sitemap</a></li>
            </ul>
          </div>
          <div>
            <div className="text-white text-lg font-semibold mb-4 tracking-widest">EXPLORE</div>
            <ul className="space-y-2">
              <li><a href="#" className="text-white font-bold hover:underline">FAQ</a></li>
              <li><a href="#" className="text-white font-bold hover:underline">Blogs</a></li>
              <li><a href="#" className="text-white font-bold hover:underline">About Us</a></li>
              <li><a href="#" className="text-white font-bold hover:underline">Terms & Conditions</a></li>
            </ul>
          </div>
        </div>
        {/* Social Icons */}
        <div className="flex-1 flex flex-row justify-center md:justify-end items-center gap-4 mt-8 md:mt-0">
          {socialIcons.map((icon, i) => (
            <a key={i} href={icon.href} aria-label={icon.name} className="hover:opacity-80">{icon.svg}</a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export { Footer, SimpleFooter };
export default Footer;