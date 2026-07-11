import React from 'react';
import heroBg from '../assets/hero.jpg';

function Landing({ onGetStarted }) {
  // Smooth scroll handler
  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-[#f4f4f5] relative overflow-hidden flex flex-col justify-between font-sans">
      
      {/* Backdrop Image & Ambient Gradients (Violet/Purple Theme) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img 
          src={heroBg} 
          alt="IT Infrastructure Backdrop" 
          className="w-full h-full object-cover opacity-35 filter brightness-[0.4] contrast-[1.1] saturate-[0.8]" 
        />
        {/* Fades image out from transparent at the top to deep carbon-black at the bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0c0c0e]/60 to-[#0c0c0e]"></div>
        
        {/* Soft background glows (Violet) */}
        <div className="absolute top-[-10%] left-[5%] w-[600px] h-[600px] bg-[#8b5cf6]/5 rounded-full blur-[145px]"></div>
        <div className="absolute bottom-[5%] right-[-5%] w-[600px] h-[600px] bg-[#4a5568]/10 rounded-full blur-[145px]"></div>
      </div>

      {/* 1. Header Navbar */}
      <header className="border-b border-[#1b1b1f] bg-[#0c0c0e]/85 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          
          {/* Left aligned logo and navigation links group */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 bg-[#8b5cf6] rounded-lg flex items-center justify-center font-black text-black shadow-lg shadow-[#8b5cf6]/25">
                N
              </div>
              <span className="text-lg font-black text-white tracking-widest uppercase">NetTrack</span>
            </div>

            {/* Navigation Links directly next to the brand logo */}
            <div className="hidden sm:flex items-center space-x-6 border-l border-[#1b1b1f] pl-6">
              <button 
                onClick={() => handleScrollTo('lifecycle-section')}
                className="text-xs font-extrabold text-[#a1a1aa] hover:text-[#8b5cf6] uppercase tracking-wider cursor-pointer transition-colors focus:outline-none"
              >
                Lifecycle
              </button>
              <button 
                onClick={() => handleScrollTo('capabilities-section')}
                className="text-xs font-extrabold text-[#a1a1aa] hover:text-[#8b5cf6] uppercase tracking-wider cursor-pointer transition-colors focus:outline-none"
              >
                Features
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            onClick={onGetStarted}
            className="text-sm font-bold bg-[#16161a] hover:bg-[#1f1f24] text-[#8b5cf6] border border-[#8b5cf6]/20 hover:border-[#8b5cf6]/40 px-5 py-2 rounded-xl transition-all cursor-pointer focus:outline-none"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* 2. Custom Layout Hero Section (Left-aligned text, Bleeding Right-side SVG) */}
      <main className="max-w-6xl mx-auto px-6 py-20 flex-grow relative z-10 w-full">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline and CTA */}
          <div className="lg:col-span-7 text-left space-y-6">

            {/* Hero Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none uppercase">
              Digital Hardware Registry <br />
              <span className="text-[#8b5cf6]">
                For Client IT Infrastructures
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-[#94a3b8] text-base md:text-lg leading-relaxed max-w-xl font-medium">
              The ultimate internal register for tracking office routers, switches, and AV equipment installed at client companies. Enforce RBAC, report hardware issues, and export CSV spreadsheets.
            </p>

            {/* CTA Button */}
            <div className="pt-2">
              <button
                onClick={onGetStarted}
                className="bg-[#8b5cf6] hover:bg-[#a78bfa] text-black font-extrabold px-8 py-4 rounded-xl shadow-xl shadow-[#8b5cf6]/10 hover:shadow-[#8b5cf6]/20 transition-all cursor-pointer text-base uppercase tracking-wider focus:outline-none"
              >
                Get Started &rarr;
              </button>
            </div>

          </div>

          {/* Right Column: Role-Based Access SVG Diagram (Asymmetric right-bleed layout, Violet theme) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end translate-x-0 lg:translate-x-12">
            <svg viewBox="0 0 450 320" className="w-full h-auto max-w-md select-none drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
              
              {/* Client Panel */}
              <rect x="10" y="10" width="130" height="290" rx="12" fill="#16161a" stroke="#2c2c35" strokeWidth="1.5" />
              <text x="38" y="42" fill="#ffffff" fontFamily="sans-serif" fontSize="13" fontWeight="900" letterSpacing="1">CLIENT</text>
              <line x1="25" y1="60" x2="125" y2="60" stroke="#2c2c35" strokeWidth="1.5" />
              
              {/* Client Checklist */}
              {/* View (Allow) */}
              <circle cx="32" cy="100" r="8" fill="#8b5cf6" fillOpacity="0.1" stroke="#8b5cf6" strokeWidth="1.2" />
              <path d="M29 100 l2 2 l4 -4" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <text x="50" y="104" fill="#f4f4f5" fontFamily="sans-serif" fontSize="10" fontWeight="600">View Devices</text>

              {/* Raise Issue (Allow) */}
              <circle cx="32" cy="140" r="8" fill="#8b5cf6" fillOpacity="0.1" stroke="#8b5cf6" strokeWidth="1.2" />
              <path d="M29 140 l2 2 l4 -4" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <text x="50" y="144" fill="#f4f4f5" fontFamily="sans-serif" fontSize="10" fontWeight="600">Raise Issue</text>

              {/* Edit (Deny) */}
              <circle cx="32" cy="180" r="8" fill="#4a5568" fillOpacity="0.1" stroke="#4a5568" strokeWidth="1.2" />
              <path d="M28 176 l8 8 M36 176 l-8 8" stroke="#4a5568" strokeWidth="1.5" strokeLinecap="round" />
              <text x="50" y="184" fill="#64748b" fontFamily="sans-serif" fontSize="10" fontWeight="600">Edit Asset</text>

              {/* Delete (Deny) */}
              <circle cx="32" cy="220" r="8" fill="#4a5568" fillOpacity="0.1" stroke="#4a5568" strokeWidth="1.2" />
              <path d="M28 216 l8 8 M36 216 l-8 8" stroke="#4a5568" strokeWidth="1.5" strokeLinecap="round" />
              <text x="50" y="224" fill="#64748b" fontFamily="sans-serif" fontSize="10" fontWeight="600">Delete Asset</text>


              {/* Technician Panel */}
              <rect x="155" y="10" width="130" height="290" rx="12" fill="#16161a" stroke="#2c2c35" strokeWidth="1.5" />
              <text x="195" y="42" fill="#ffffff" fontFamily="sans-serif" fontSize="13" fontWeight="900" letterSpacing="1">TECH</text>
              <line x1="170" y1="60" x2="270" y2="60" stroke="#2c2c35" strokeWidth="1.5" />
              
              {/* Tech Checklist */}
              {/* View (Allow) */}
              <circle cx="177" cy="100" r="8" fill="#8b5cf6" fillOpacity="0.1" stroke="#8b5cf6" strokeWidth="1.2" />
              <path d="M174 100 l2 2 l4 -4" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <text x="195" y="104" fill="#f4f4f5" fontFamily="sans-serif" fontSize="10" fontWeight="600">View Devices</text>

              {/* Add (Allow) */}
              <circle cx="177" cy="140" r="8" fill="#8b5cf6" fillOpacity="0.1" stroke="#8b5cf6" strokeWidth="1.2" />
              <path d="M174 140 l2 2 l4 -4" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <text x="195" y="144" fill="#f4f4f5" fontFamily="sans-serif" fontSize="10" fontWeight="600">Add Asset</text>

              {/* Edit (Allow) */}
              <circle cx="177" cy="180" r="8" fill="#8b5cf6" fillOpacity="0.1" stroke="#8b5cf6" strokeWidth="1.2" />
              <path d="M174 180 l2 2 l4 -4" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <text x="195" y="184" fill="#f4f4f5" fontFamily="sans-serif" fontSize="10" fontWeight="600">Edit Asset</text>

              {/* Delete (Deny) */}
              <circle cx="177" cy="220" r="8" fill="#4a5568" fillOpacity="0.1" stroke="#4a5568" strokeWidth="1.2" />
              <path d="M173 216 l8 8 M181 216 l-8 8" stroke="#4a5568" strokeWidth="1.5" strokeLinecap="round" />
              <text x="195" y="224" fill="#64748b" fontFamily="sans-serif" fontSize="10" fontWeight="600">Delete Asset</text>


              {/* Admin Panel */}
              <rect x="300" y="10" width="130" height="290" rx="12" fill="#16161a" stroke="#2c2c35" strokeWidth="1.5" />
              <text x="338" y="42" fill="#ffffff" fontFamily="sans-serif" fontSize="13" fontWeight="900" letterSpacing="1">ADMIN</text>
              <line x1="315" y1="60" x2="415" y2="60" stroke="#2c2c35" strokeWidth="1.5" />
              
              {/* Admin Checklist */}
              {/* View (Allow) */}
              <circle cx="322" cy="100" r="8" fill="#8b5cf6" fillOpacity="0.1" stroke="#8b5cf6" strokeWidth="1.2" />
              <path d="M319 100 l2 2 l4 -4" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <text x="340" y="104" fill="#f4f4f5" fontFamily="sans-serif" fontSize="10" fontWeight="600">View Devices</text>

              {/* Add (Allow) */}
              <circle cx="322" cy="140" r="8" fill="#8b5cf6" fillOpacity="0.1" stroke="#8b5cf6" strokeWidth="1.2" />
              <path d="M319 140 l2 2 l4 -4" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <text x="340" y="144" fill="#f4f4f5" fontFamily="sans-serif" fontSize="10" fontWeight="600">Add Asset</text>

              {/* Edit (Allow) */}
              <circle cx="322" cy="180" r="8" fill="#8b5cf6" fillOpacity="0.1" stroke="#8b5cf6" strokeWidth="1.2" />
              <path d="M319 180 l2 2 l4 -4" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <text x="340" y="184" fill="#f4f4f5" fontFamily="sans-serif" fontSize="10" fontWeight="600">Edit Asset</text>

              {/* Delete (Allow) */}
              <circle cx="322" cy="220" r="8" fill="#8b5cf6" fillOpacity="0.1" stroke="#8b5cf6" strokeWidth="1.2" />
              <path d="M319 220 l2 2 l4 -4" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <text x="340" y="224" fill="#f4f4f5" fontFamily="sans-serif" fontSize="10" fontWeight="600">Delete Asset</text>

            </svg>
          </div>

        </div>

        {/* 3. System Lifecycle Section */}
        <section id="lifecycle-section" className="w-full mt-32 scroll-mt-24">
          <h2 className="text-xl font-black text-white text-left uppercase tracking-widest border-l-2 border-[#4a5568] pl-3 mb-12">
            System Lifecycle // Step-By-Step
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
            
            {/* Card 1: Purple accent border (100% opacity) */}
            <div className="md:col-span-4 bg-[#16161a]/70 border-t-2 border-t-[#8b5cf6] border-x border-b border-[#1b1b1f] p-8 rounded-b-2xl relative transition-all duration-300 hover:border-[#8b5cf6]/30">
              <div className="absolute -top-5 left-8 w-9 h-9 bg-[#8b5cf6] text-black rounded-lg flex items-center justify-center font-black text-sm shadow-md shadow-[#8b5cf6]/10">
                01
              </div>
              <h3 className="text-base font-black text-white mt-4 uppercase tracking-wider">Onboard Hardware</h3>
              <p className="text-[#94a3b8] text-xs mt-3 leading-relaxed">
                Admins log newly installed switches, routers, and IP phones into the register, detailing client locations and warranty expirations.
              </p>
            </div>

            {/* Card 2: Medium Purple accent border (60% opacity) */}
            <div className="md:col-span-4 bg-[#16161a]/45 border-t-2 border-t-[#8b5cf6]/60 border-x border-b border-[#1b1b1f] p-8 rounded-b-2xl relative translate-y-0 md:translate-y-2 transition-all duration-300 hover:border-[#8b5cf6]/30">
              <div className="absolute -top-5 left-8 w-9 h-9 bg-[#8b5cf6]/60 text-black rounded-lg flex items-center justify-center font-black text-sm">
                02
              </div>
              <h3 className="text-base font-black text-white mt-4 uppercase tracking-wider">Audit & Authorize</h3>
              <p className="text-[#94a3b8] text-xs mt-3 leading-relaxed">
                Technicians audit equipment details, and Clients are granted read-only portal access strictly partitioned to their own company's devices.
              </p>
            </div>

            {/* Card 3: Low Purple accent border (30% opacity) */}
            <div className="md:col-span-4 bg-[#16161a]/70 border-t-2 border-t-[#8b5cf6]/30 border-x border-b border-[#1b1b1f] p-8 rounded-b-2xl relative transition-all duration-300 hover:border-[#8b5cf6]/30">
              <div className="absolute -top-5 left-8 w-9 h-9 bg-[#8b5cf6]/30 text-[#8b5cf6] rounded-lg flex items-center justify-center font-black text-sm border border-[#8b5cf6]/20 bg-[#8b5cf6]/10">
                03
              </div>
              <h3 className="text-base font-black text-white mt-4 uppercase tracking-wider">Report & Resolve</h3>
              <p className="text-[#94a3b8] text-xs mt-3 leading-relaxed">
                Clients report hardware failures with one click. Technicians investigate, perform maintenance, and restore the asset back to Active status.
              </p>
            </div>

          </div>
        </section>

        {/* 4. Core Features Grid */}
        <section id="capabilities-section" className="w-full mt-16 border-t border-[#1b1b1f]/50 pt-10 scroll-mt-24">
          <h2 className="text-xl font-black text-white text-left uppercase tracking-widest border-l-2 border-[#4a5568] pl-3 mb-12">
            System Capabilities // Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: RBAC */}
            <div className="bg-[#16161a]/20 border border-[#1b1b1f] p-6 rounded-2xl text-left space-y-3">
              {/* Normalized Lock Icon */}
              <svg className="w-6 h-6 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Granular Permissions</h4>
              <p className="text-[#94a3b8] text-xs leading-relaxed">
                Backend routes are locked with custom validation middleware, guarding data across Admin, Technician, and Client scopes.
              </p>
            </div>

            {/* Card 2: Isolation */}
            <div className="bg-[#16161a]/20 border border-[#1b1b1f] p-6 rounded-2xl text-left space-y-3">
              {/* Normalized Shield Icon */}
              <svg className="w-6 h-6 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7s0 6 8 10z" />
              </svg>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Client Multi-Tenancy</h4>
              <p className="text-[#94a3b8] text-xs leading-relaxed">
                No cross-visibility. Clients can only see and report issues on hardware installed in their specific office space.
              </p>
            </div>

            {/* Card 3: CSV */}
            <div className="bg-[#16161a]/20 border border-[#1b1b1f] p-6 rounded-2xl text-left space-y-3">
              {/* Normalized Download Icon */}
              <svg className="w-6 h-6 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Instant Reporting</h4>
              <p className="text-[#94a3b8] text-xs leading-relaxed">
                Auditors can instantly export custom search and filter tables straight into standard CSV spreadsheets with one click.
              </p>
            </div>

          </div>
        </section>

      </main>

      {/* 5. Footer */}
      <footer className="border-t border-[#1b1b1f] py-6 text-center text-xs text-zinc-600 relative z-10 bg-[#0c0c0e]">
        <p>NetTrack &copy; 2026. Custom IT Asset registry built for MVD Technologies.</p>
      </footer>

    </div>
  );
}

export default Landing;