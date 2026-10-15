import React from 'react';
import { NavigationTab } from '../types';

interface FooterProps {
  onSelectTab: (tab: NavigationTab) => void;
  onOpenDisclaimerModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onOpenDisclaimerModal }) => {
  return (
    <footer className="border-t border-[#ECE4DA] bg-[#FDFBF7] py-12 mt-16 text-[#766A65]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          {/* Left Brand & Disclaimer Summary */}
          <div className="flex items-start gap-3 max-w-xl">
            <div className="w-8 h-8 rounded-full bg-[#8B3E42] text-white flex items-center justify-center font-serif text-sm font-semibold shrink-0 mt-0.5">
              D
            </div>
            <div>
              <div className="font-serif text-lg font-semibold text-[#221A16]">Deha-Chitra</div>
              <p className="text-xs text-[#766A65] mt-1 leading-relaxed">
                © 2024 Deha-Chitra (देह-चित्र). Nurturing women's self-advocacy &amp; body literacy; 
                not intended to replace formal medical diagnosis or clinical treatment.
              </p>
            </div>
          </div>

          {/* Right Navigation & Legal Links */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-[#544342]">
            <button
              onClick={onOpenDisclaimerModal}
              className="hover:text-[#8B3E42] transition-colors cursor-pointer"
            >
              Clinical Disclaimer
            </button>
            <button
              onClick={() => onSelectTab('subtypes')}
              className="hover:text-[#8B3E42] transition-colors cursor-pointer"
            >
              Evidence &amp; Methodology
            </button>
            <button
              onClick={() => onSelectTab('find-care')}
              className="hover:text-[#8B3E42] transition-colors cursor-pointer"
            >
              Find Verified Specialists
            </button>
            <button
              onClick={onOpenDisclaimerModal}
              className="hover:text-[#8B3E42] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onSelectTab('translator')}
              className="hover:text-[#8B3E42] transition-colors cursor-pointer"
            >
              Regional Language Support
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
};
