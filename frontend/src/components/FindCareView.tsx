import React, { useState } from 'react';
import { DoctorSpecialist, NavigationTab } from '../types';
import { VETTED_DOCTORS } from '../data/pcosData';
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  Filter, 
  Stethoscope, 
  ShieldCheck, 
  Check, 
  Globe, 
  ArrowRight,
  HeartHandshake
} from 'lucide-react';

interface FindCareViewProps {
  onSelectTab: (tab: NavigationTab) => void;
  onSelectDoctorForBooking: (doctor: DoctorSpecialist) => void;
}

export const FindCareView: React.FC<FindCareViewProps> = ({
  onSelectTab,
  onSelectDoctorForBooking,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [selectedMode, setSelectedMode] = useState<string>('All');

  const filteredPractitioners = VETTED_DOCTORS.filter((doc) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = 
        doc.name.toLowerCase().includes(q) ||
        doc.role.toLowerCase().includes(q) ||
        doc.location.toLowerCase().includes(q) ||
        doc.bio.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Role filter
    if (selectedRole !== 'All') {
      if (selectedRole === 'Gynecologist' && !doc.role.includes('Gynecologist') && !doc.role.includes('DGO')) return false;
      if (selectedRole === 'Endocrinologist' && !doc.role.includes('Endocrinologist')) return false;
      if (selectedRole === 'Dietitian' && !doc.role.includes('Nutritionist')) return false;
    }

    // City filter
    if (selectedCity !== 'All') {
      if (!doc.location.toLowerCase().includes(selectedCity.toLowerCase())) return false;
    }

    // Language filter
    if (selectedLanguage !== 'All') {
      if (!doc.languages.some(l => l.toLowerCase().includes(selectedLanguage.toLowerCase()))) return false;
    }

    // Mode filter
    if (selectedMode !== 'All') {
      if (selectedMode === 'Telehealth' && !doc.modes.includes('Telehealth')) return false;
      if (selectedMode === 'In-Person' && !doc.modes.includes('In-Person')) return false;
    }

    return true;
  });

  return (
    <div className="space-y-10 pb-16">
      
      {/* Hero Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDF2EE] text-[#4D6A5A] text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Vetted &amp; Trauma-Informed Practitioner Network</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-[46px] font-normal text-[#221A16] leading-[1.2]">
          Find PCOS-Affirming Specialists <br />
          <span className="italic font-serif">Who Listen &amp; Investigate</span>
        </h1>
        <p className="font-sans text-base text-[#544342] leading-relaxed">
          Every practitioner in our sanctuary directory has committed to root-cause hormonal diagnostics, non-weight-stigmatizing consultations, and patient-centered treatment plans.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-[#ECE4DA] p-5 shadow-xs space-y-4">
        
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#766A65]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by doctor name, specialty (e.g. endocrinologist, dietitian), or clinical keyword..."
            className="w-full bg-[#FDFBF7] border border-[#D9CDC1] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#221A16] outline-none focus:border-[#8B3E42]"
          />
        </div>

        {/* Filter Pills / Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-[#766A65]">Clinical Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full bg-[#FDFBF7] border border-[#ECE4DA] rounded-lg p-2 text-[#221A16] outline-none"
            >
              <option value="All">All Roles</option>
              <option value="Endocrinologist">Endocrinologist</option>
              <option value="Gynecologist">Gynecologist (OB/GYN)</option>
              <option value="Dietitian">Metabolic Dietitian</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-[#766A65]">Region / City</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-[#FDFBF7] border border-[#ECE4DA] rounded-lg p-2 text-[#221A16] outline-none"
            >
              <option value="All">All Locations &amp; Telehealth</option>
              <option value="Delhi">Delhi NCR</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Chennai">Chennai</option>
              <option value="Kolkata">Kolkata</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-[#766A65]">Language</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full bg-[#FDFBF7] border border-[#ECE4DA] rounded-lg p-2 text-[#221A16] outline-none"
            >
              <option value="All">All Languages</option>
              <option value="Hindi">Hindi</option>
              <option value="Tamil">Tamil</option>
              <option value="Bengali">Bengali</option>
              <option value="Marathi">Marathi</option>
              <option value="English">English</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-[#766A65]">Care Format</label>
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="w-full bg-[#FDFBF7] border border-[#ECE4DA] rounded-lg p-2 text-[#221A16] outline-none"
            >
              <option value="All">All Formats</option>
              <option value="Telehealth">Telehealth Video</option>
              <option value="In-Person">In-Person In-Clinic</option>
            </select>
          </div>

        </div>

      </div>

      {/* Results List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-[#766A65]">
          <span>Showing <strong>{filteredPractitioners.length}</strong> verified practitioners</span>
          <button 
            onClick={() => {
              setSearchQuery('');
              setSelectedRole('All');
              setSelectedCity('All');
              setSelectedLanguage('All');
              setSelectedMode('All');
            }}
            className="text-[#8B3E42] hover:underline font-semibold"
          >
            Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredPractitioners.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl border border-[#ECE4DA] p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#8B3E42]/50 hover:shadow-md transition-all"
            >
              <div className="space-y-4">
                
                {/* Doctor Header */}
                <div className="flex items-start gap-4">
                  <img
                    src={doc.avatarUrl}
                    alt={doc.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#ECE4DA] shrink-0"
                  />
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <h3 className="font-serif text-lg font-bold text-[#221A16]">{doc.name}</h3>
                      <span className="text-xs font-semibold text-[#8B3E42]">{doc.fee}</span>
                    </div>
                    <p className="text-xs text-[#4D6A5A] font-medium">{doc.role}</p>
                    <p className="text-[11px] text-[#766A65]">{doc.qualification} • {doc.experienceYears} years practice</p>
                    <div className="flex items-center gap-1.5 pt-0.5 text-xs text-[#8B3E42] font-semibold">
                      <Star className="w-3.5 h-3.5 fill-[#8B3E42]" />
                      <span>{doc.rating}</span>
                      <span className="text-[#766A65] text-[11px]">({doc.reviewCount} verified reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-[#544342] leading-relaxed">
                  {doc.bio}
                </p>

                {/* Tags & Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {doc.tags.map((tag, idx) => (
                    <span key={idx} className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#EDF2EE] text-[#4D6A5A] font-medium">
                      ✓ {tag}
                    </span>
                  ))}
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#F5EFE6] text-[#766A65]">
                    {doc.languages.join(', ')}
                  </span>
                </div>

                {/* Location & Modalities */}
                <div className="text-xs text-[#766A65] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#8B3E42]" />
                  <span>{doc.location}</span>
                  <span className="text-[#ECE4DA]">•</span>
                  <span>{doc.modes.join(' & ')}</span>
                </div>

              </div>

              {/* Bottom Slot & CTA */}
              <div className="pt-4 border-t border-[#ECE4DA] flex items-center justify-between">
                <div className="text-xs text-[#766A65]">
                  Earliest Slot: <strong className="text-[#221A16]">{doc.nextSlot}</strong>
                </div>

                <button
                  onClick={() => onSelectDoctorForBooking(doc)}
                  className="px-4 py-2 rounded-xl bg-[#8B3E42] hover:bg-[#6E272C] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Book Consultation
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
