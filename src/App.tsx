import React, { useState } from 'react';
import { Randomizer } from './components/Randomizer';
import { Share2, Check, Wrench } from 'lucide-react';

const App: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'GT7 Spec Randomizer',
          text: 'Generate random races for Gran Turismo 7!',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Official-style Navbar */}
      <header className="bg-black h-16 border-b border-[#222] sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto h-full flex items-center justify-between px-6">
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            {/* Utility / QoL Icon */}
            <div className="w-8 h-8 bg-[#1a1a1a] border border-[#333] rounded flex items-center justify-center">
              <Wrench size={16} className="text-gray-300" />
            </div>
            <div className="h-5 w-[1px] bg-[#333] hidden sm:block"></div>
            <h1 className="text-lg font-bold tracking-tight text-white uppercase hidden sm:block">
              Event <span className="text-[#E60012]">Randomizer</span>
            </h1>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-1.5 bg-[#E60012] hover:bg-[#c0000f] transition-colors text-white text-[11px] font-bold uppercase tracking-widest"
            >
              {copied ? <Check size={14} /> : <Share2 size={14} />}
              {copied ? 'Copied' : 'Share'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow w-full max-w-[1400px] mx-auto px-4 md:px-6 py-12">
        {/* Page Title Section */}
        <div className="mb-10 pl-6 border-l-4 border-[#E60012]">
          <h2 className="text-3xl md:text-5xl font-light text-white uppercase tracking-tight">
            Event <span className="font-bold">Generator</span>
          </h2>
          <p className="text-gray-400 mt-2 text-sm max-w-2xl">
            Create your custom race specification. Randomize cars, tracks, and
            environmental conditions.
          </p>
        </div>

        <Randomizer />
      </main>

      {/* Official-style Footer */}
      <footer className="bg-[#0a0a0a] border-t border-[#222] py-12 px-6 mt-12">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8 text-[11px] text-gray-600 font-bold uppercase tracking-widest">
          <div className="flex flex-col gap-2">
            <span className="text-gray-500">Unofficial Tool</span>
            <span>
              Not affiliated with Polyphony Digital Inc or Sony Interactive
              Entertainment.
            </span>
          </div>
          <div className="flex gap-8">
            <span>Last update: 1.65 - Spec III</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
