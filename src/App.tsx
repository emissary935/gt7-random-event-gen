import React, { useState } from 'react';
import { Randomizer } from './components/Randomizer';
import { Share2, Check, Wrench, Github } from 'lucide-react';

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
          <div className="flex items-center gap-3">
            
            {/* Tasto GitHub (Nuovo) */}
            <a
              href="https://github.com/emissary935/gt7-random-event-gen"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] hover:bg-[#333] border border-[#333] rounded transition-colors text-gray-300 hover:text-white text-[11px] font-bold uppercase tracking-widest"
              title="View Source Code"
            >
              <Github size={14} />
              <span className="hidden sm:inline">Source</span>
            </a>

            {/* Tasto Share (Esistente) */}
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-1.5 bg-[#E60012] hover:bg-[#c0000f] transition-colors text-white text-[11px] font-bold uppercase tracking-widest rounded"
            >
              {copied ? <Check size={14} /> : <Share2 size={14} />}
              {copied ? 'Copied' : 'Share'}
            </button>
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
          <div className="flex flex-col md:items-end gap-1 text-right">
  <span>Last update: 1.65 - Spec III</span>
  <span className="text-[#E60012] font-bold uppercase tracking-widest text-[10px]">
    Warning: May contain traces of Gr.3 at Spa
  </span>
</div>
        </div>
      </footer>
    </div>
  );
};

export default App;
