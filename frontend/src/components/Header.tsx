import React, { useState } from 'react';
import { NavigationTab, LanguageCode } from '../types';
import { Globe, User, ChevronDown, Menu, X, Sparkles, Stethoscope } from 'lucide-react';

interface HeaderProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  selectedLanguage: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  selectedLanguage,
  onSelectLanguage,
}) => {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const languages: { code: LanguageCode; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'hinglish', label: 'Hinglish', native: 'Hinglish' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  ];

  const currentLangLabel = languages.find((l) => l.code === selectedLanguage)?.label || 'English';

  const navItems: { id: NavigationTab; label: string }[] = [
    { id: 'translator', label: 'Symptom Translator' },
    { id: 'subtypes', label: 'PCOS Subtypes' },
    { id: 'doctor-prep', label: 'Doctor Prep' },
    { id: 'find-care', label: 'Find Care' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#ECE4DA] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Identity */}
          <div 
            onClick={() => onSelectTab('translator')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-[#8B3E42] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <span className="font-serif text-xl font-medium tracking-tight">D</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-semibold tracking-tight text-[#221A16] group-hover:text-[#8B3E42] transition-colors leading-none">
                Deha-Chitra
              </span>
              <span className="text-xs text-[#766A65] font-sans tracking-wide mt-1">
                देह-चित्र • Body Story
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-6">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`relative px-3 py-2 text-[15px] font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'text-[#8B3E42] font-semibold'
                      : 'text-[#544342] hover:text-[#221A16]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2.5px] bg-[#8B3E42] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Utilities: Language, Consultation Prep CTA & Profile */}
          <div className="hidden sm:flex items-center space-x-3 lg:space-x-4">
            
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#544342] hover:text-[#221A16] bg-[#F5EFE6]/70 hover:bg-[#F5EFE6] rounded-full border border-[#ECE4DA] transition-colors cursor-pointer"
                title="Change language"
              >
                <Globe className="w-4 h-4 text-[#4D6A5A]" />
                <span className="text-xs font-semibold">{currentLangLabel}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#766A65]" />
              </button>

              {langDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#ECE4DA] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setLangDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-[#766A65] uppercase tracking-wider border-b border-[#ECE4DA]/60">
                    Language / भाषा
                  </div>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onSelectLanguage(lang.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-sm flex items-center justify-between transition-colors cursor-pointer ${
                        selectedLanguage === lang.code
                          ? 'bg-[#FBF2F2] text-[#8B3E42] font-semibold'
                          : 'text-[#221A16] hover:bg-[#F5EFE6]'
                      }`}
                    >
                      <span>{lang.label}</span>
                      <span className="text-xs text-[#766A65]">{lang.native}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Start Consultation Prep CTA Button */}
            <button
              onClick={() => onSelectTab('doctor-prep')}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#8B3E42] hover:bg-[#6E272C] text-white text-sm font-medium rounded-full shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <Stethoscope className="w-4 h-4 text-[#FFBBBB]" />
              <span>Start Consultation Prep</span>
            </button>

            {/* Profile Avatar Icon */}
            <button 
              className="w-10 h-10 rounded-full border border-[#ECE4DA] bg-white flex items-center justify-center text-[#544342] hover:text-[#8B3E42] hover:border-[#8B3E42] transition-colors cursor-pointer shadow-xs"
              title="Patient Sanctuary Profile"
            >
              <User className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => onSelectTab('doctor-prep')}
              className="text-xs px-3 py-1.5 bg-[#8B3E42] text-white rounded-full font-medium"
            >
              Consult Prep
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#544342] hover:text-[#221A16] hover:bg-[#F5EFE6]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#ECE4DA] bg-[#FDFBF7] px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                  activeTab === item.id
                    ? 'bg-[#FBF2F2] text-[#8B3E42] font-semibold'
                    : 'text-[#544342] hover:bg-[#F5EFE6]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-[#ECE4DA] flex flex-wrap gap-2">
            <span className="text-xs text-[#766A65] w-full mb-1">Language:</span>
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  onSelectLanguage(l.code);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  selectedLanguage === l.code
                    ? 'bg-[#8B3E42] text-white border-[#8B3E42]'
                    : 'bg-white text-[#544342] border-[#ECE4DA]'
                }`}
              >
                {l.native}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
