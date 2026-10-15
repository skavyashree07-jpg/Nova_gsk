import React, { useState } from 'react';
import { NavigationTab, DoctorSpecialist } from '../types';
import { 
  PRESET_TERMINOLOGY_MAPPINGS, 
  MUST_ASK_LAB_PANEL, 
  VETTED_DOCTORS, 
  DISMISSAL_SCRIPTS 
} from '../data/pcosData';
import { 
  Check, 
  Copy, 
  CheckCheck, 
  Share2, 
  Download, 
  Mic, 
  Star, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Info, 
  Plus, 
  X, 
  MessageSquare, 
  Send,
  Stethoscope,
  Sparkles
} from 'lucide-react';

interface DoctorPrepViewProps {
  onSelectTab: (tab: NavigationTab) => void;
  onOpenDoctorBrief: () => void;
  onSelectDoctorForBooking: (doctor: DoctorSpecialist) => void;
}

export const DoctorPrepView: React.FC<DoctorPrepViewProps> = ({
  onSelectTab,
  onOpenDoctorBrief,
  onSelectDoctorForBooking,
}) => {
  // Lived Experience State
  const [cyclePattern, setCyclePattern] = useState<string>(
    "Average 45–60 days; last period was 72 days ago with heavy 2–day flow"
  );
  const [familyHistory, setFamilyHistory] = useState<string>(
    "Type 2 Diabetes (Mother, Maternal Aunt), Early Gestational Diabetes"
  );
  const [physicalTags, setPhysicalTags] = useState<string[]>([
    "Chin hirsutism", 
    "Post-meal fatigue", 
    "Acanthosis nigricans"
  ]);
  const [newTagInput, setNewTagInput] = useState<string>('');
  const [isAddingTag, setIsAddingTag] = useState<boolean>(false);
  const [emotionalImpact, setEmotionalImpact] = useState<string>(
    "Significant energy crashes at 2 PM; persistent sleep latency; heightened distress regarding unexplained weight shifts despite consistent nutrition."
  );

  // Lab Markers Checklist State
  const [selectedLabs, setSelectedLabs] = useState<string[]>(
    MUST_ASK_LAB_PANEL.map(l => l.id)
  );

  // Copy Feedback state
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);

  // Doctor Filter State
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('All');
  const [modeFilter, setModeFilter] = useState<string>('All');
  const [languageFilter, setLanguageFilter] = useState<string>('All');

  // Interactive Custom Phrase Translator
  const [customEveryday, setCustomEveryday] = useState<string>('');
  const [customTranslated, setCustomTranslated] = useState<string>('');

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCopySummary = () => {
    const summaryText = `--- DEHA-CHITRA CLINICAL CONSULTATION BRIEF ---
Patient Lived Experience:
- Menstrual Rhythm: ${cyclePattern}
- Family Metabolic History: ${familyHistory}
- Physical Manifestations: ${physicalTags.join(', ')}
- Quality of Life / Emotional Impact: ${emotionalImpact}

Recommended Laboratory Panels Requested:
${MUST_ASK_LAB_PANEL.filter(l => selectedLabs.includes(l.id)).map(l => `• ${l.name} (${l.purpose})`).join('\n')}

Clinical Advocacy Note: Aligned with 2023 International Evidence-based Guidelines for the Assessment and Management of PCOS.`;

    navigator.clipboard.writeText(summaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 3000);
  };

  const handleAddTag = () => {
    if (newTagInput.trim() && !physicalTags.includes(newTagInput.trim())) {
      setPhysicalTags([...physicalTags, newTagInput.trim()]);
      setNewTagInput('');
      setIsAddingTag(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setPhysicalTags(physicalTags.filter(t => t !== tagToRemove));
  };

  const toggleLabMarker = (id: string) => {
    if (selectedLabs.includes(id)) {
      setSelectedLabs(selectedLabs.filter(l => l !== id));
    } else {
      setSelectedLabs([...selectedLabs, id]);
    }
  };

  const handleTranslateCustomPhrase = () => {
    if (!customEveryday.trim()) return;
    const lower = customEveryday.toLowerCase();
    let phrase = "I am observing cyclical hormonal dysregulation and request objective biomarker assessment.";
    if (lower.includes('hair') || lower.includes('shed') || lower.includes('scalp')) {
      phrase = "I present with diffuse androgenic telogen effluvium and elevated free androgen activity.";
    } else if (lower.includes('acne') || lower.includes('oil') || lower.includes('face')) {
      phrase = "I note persistent inflammatory follicular lesions refractory to topical treatments, consistent with hyperandrogenism.";
    } else if (lower.includes('tired') || lower.includes('sleep') || lower.includes('crash')) {
      phrase = "I experience severe reactive hypoglycemia and post-prandial somnolence impacting daytime functional capacity.";
    }
    setCustomTranslated(phrase);
  };

  // Filtered Doctors
  const filteredDoctors = VETTED_DOCTORS.filter((doc) => {
    if (specialtyFilter !== 'All') {
      if (specialtyFilter === 'Gynecologist' && !doc.role.includes('Gynecologist') && !doc.role.includes('DGO')) return false;
      if (specialtyFilter === 'Reproductive Endo' && !doc.role.includes('Endocrinologist')) return false;
      if (specialtyFilter === 'PCOS Dietitian' && !doc.role.includes('Nutritionist')) return false;
    }
    if (modeFilter !== 'All') {
      if (modeFilter === 'Telehealth Only' && doc.modes.includes('In-Person')) return false;
      if (modeFilter === 'In-Person' && !doc.modes.includes('In-Person')) return false;
    }
    if (languageFilter !== 'All') {
      if (!doc.languages.some(l => l.toLowerCase().includes(languageFilter.toLowerCase()))) return false;
    }
    return true;
  });

  return (
    <div className="space-y-10 pb-16">
      
      {/* Top Banner: Gentle Guidance & Clinical Note */}
      <div className="rounded-xl bg-[#F5EFE6] border-l-4 border-[#4D6A5A] border-y border-r border-[#ECE4DA] p-5">
        <div className="text-[11px] font-semibold text-[#4D6A5A] uppercase tracking-wider mb-1">
          Gentle Guidance &amp; Non-Diagnostic Clinical Note
        </div>
        <p className="text-xs sm:text-[13px] text-[#544342] leading-relaxed">
          This personalized guide organizes your bodily patterns to help you lead an unhurried, collaborative dialogue with your care provider. It is designed to empower, validate, and support your self-advocacy journey.
        </p>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Intake Sections & Labs */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Section 1: Lived Experience & Symptom Timeline */}
          <div className="bg-white rounded-2xl border border-[#ECE4DA] p-6 shadow-xs space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#ECE4DA]/70">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#221A16]">
                  1. Lived Experience &amp; Symptom Timeline
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#EDF2EE] text-[#4D6A5A] text-xs font-medium">
                Section Ready
              </span>
            </div>

            {/* Menstrual Pattern Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#544342]">
                Menstrual Cycle Pattern &amp; Duration
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={cyclePattern}
                  onChange={(e) => setCyclePattern(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-[#FDFBF7] border border-[#D9CDC1] rounded-xl px-3.5 py-2.5 pr-10 text-[#221A16] focus:border-[#8B3E42] focus:ring-1 focus:ring-[#8B3E42] outline-none"
                />
                <button 
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#766A65] hover:text-[#8B3E42]"
                  title="Voice input"
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Known Family Metabolic History */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#544342]">
                Known Family Metabolic History
              </label>
              <input
                type="text"
                value={familyHistory}
                onChange={(e) => setFamilyHistory(e.target.value)}
                className="w-full text-xs sm:text-sm bg-[#FDFBF7] border border-[#D9CDC1] rounded-xl px-3.5 py-2.5 text-[#221A16] focus:border-[#8B3E42] focus:ring-1 focus:ring-[#8B3E42] outline-none"
              />
            </div>

            {/* Current Physical Manifestations (Interactive Tags) */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#544342]">
                Current Physical Manifestations
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {physicalTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBF2F2] border border-[#8B3E42]/40 text-[#8B3E42] text-xs font-medium"
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>{tag}</span>
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-[#BA1A1A] ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {isAddingTag ? (
                  <div className="inline-flex items-center gap-1 bg-white border border-[#8B3E42] rounded-full px-2 py-0.5">
                    <input
                      type="text"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      placeholder="e.g. cystic acne"
                      onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                      className="text-xs outline-none text-[#221A16] w-28 bg-transparent"
                      autoFocus
                    />
                    <button
                      onClick={handleAddTag}
                      className="text-xs text-[#8B3E42] font-semibold"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setIsAddingTag(false)}
                      className="text-xs text-[#766A65]"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAddingTag(true)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F5EFE6] hover:bg-[#ECE4DA] text-[#766A65] text-xs font-medium border border-[#ECE4DA] cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+ Add more</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quality of Life & Emotional Impact */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#544342]">
                Quality of Life &amp; Emotional Impact
              </label>
              <textarea
                value={emotionalImpact}
                onChange={(e) => setEmotionalImpact(e.target.value)}
                rows={2}
                className="w-full text-xs sm:text-sm bg-[#FDFBF7] border border-[#D9CDC1] rounded-xl p-3 text-[#221A16] focus:border-[#8B3E42] focus:ring-1 focus:ring-[#8B3E42] outline-none resize-none leading-relaxed"
              />
            </div>

          </div>

          {/* Section 2: Clinical Terminology Translator */}
          <div className="bg-white rounded-2xl border border-[#ECE4DA] p-6 shadow-xs space-y-5">
            
            <div className="space-y-1 pb-3 border-b border-[#ECE4DA]/70">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#8B3E42]" />
                <span className="text-sm font-semibold text-[#221A16]">
                  2. Clinical Terminology Translator
                </span>
              </div>
              <p className="text-xs text-[#766A65]">
                Translate your everyday descriptions into physician-recognized diagnostic phrases.
              </p>
            </div>

            {/* Conversion Cards */}
            <div className="space-y-3.5">
              {PRESET_TERMINOLOGY_MAPPINGS.slice(0, 3).map((item) => (
                <div 
                  key={item.id}
                  className="bg-[#FDFBF7] border border-[#ECE4DA] rounded-xl p-4 space-y-2.5 transition-colors hover:border-[#8B3E42]/40"
                >
                  <div className="text-xs text-[#766A65] flex items-center gap-1.5 line-through">
                    <span className="font-serif text-sm">“</span>
                    <span>{item.everyday}</span>
                    <span className="font-serif text-sm">”</span>
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <p className="font-serif italic text-sm text-[#221A16] leading-relaxed">
                      "{item.clinical}"
                    </p>
                    <button
                      onClick={() => handleCopy(item.id, item.clinical)}
                      className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-white border border-[#ECE4DA] text-[#544342] hover:bg-[#FBF2F2] hover:text-[#8B3E42] transition-colors cursor-pointer"
                      title="Copy clinical phrasing"
                    >
                      {copiedId === item.id ? (
                        <>
                          <CheckCheck className="w-3.5 h-3.5 text-[#4D6A5A]" />
                          <span className="text-[#4D6A5A] font-semibold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Custom Phrase Converter */}
            <div className="pt-2 border-t border-[#ECE4DA]/70 space-y-2">
              <span className="text-xs font-semibold text-[#766A65]">Need another phrase translated?</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customEveryday}
                  onChange={(e) => setCustomEveryday(e.target.value)}
                  placeholder="e.g. 'My skin is super oily and hair falling in bunches'"
                  className="flex-1 text-xs bg-[#FDFBF7] border border-[#D9CDC1] rounded-xl px-3 py-2 text-[#221A16] outline-none focus:border-[#8B3E42]"
                />
                <button
                  onClick={handleTranslateCustomPhrase}
                  className="px-3.5 py-2 bg-[#F5EFE6] hover:bg-[#8B3E42] hover:text-white text-xs font-semibold text-[#544342] rounded-xl border border-[#ECE4DA] transition-colors cursor-pointer"
                >
                  Translate
                </button>
              </div>
              {customTranslated && (
                <div className="p-3 bg-[#FBF2F2] border border-[#8B3E42]/30 rounded-xl text-xs italic text-[#221A16] flex items-center justify-between gap-2">
                  <span>"{customTranslated}"</span>
                  <button
                    onClick={() => handleCopy('custom', customTranslated)}
                    className="shrink-0 text-xs text-[#8B3E42] font-semibold underline"
                  >
                    {copiedId === 'custom' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Section 3: Must-Ask Comprehensive Lab Work Panel */}
          <div className="bg-white rounded-2xl border border-[#ECE4DA] p-6 shadow-xs space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#ECE4DA]/70">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#4D6A5A]" />
                <span className="text-sm font-semibold text-[#221A16]">
                  3. Must-Ask Comprehensive Lab Work Panel
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#EDF2EE] text-[#4D6A5A] text-xs font-medium">
                {selectedLabs.length} Selected
              </span>
            </div>

            <p className="text-xs text-[#766A65]">
              Under international Rotterdam Consensus criteria, these lab panels identify specific metabolic and hormonal root causes.
            </p>

            {/* Lab Marker Checkable Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MUST_ASK_LAB_PANEL.map((lab) => {
                const isSelected = selectedLabs.includes(lab.id);
                return (
                  <div
                    key={lab.id}
                    onClick={() => toggleLabMarker(lab.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-[#FDFBF7] border-[#8B3E42]/60 shadow-xs'
                        : 'bg-[#FDFBF7]/50 border-[#ECE4DA] opacity-70'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      <div className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-[#8B3E42] text-white' : 'border border-[#766A65] bg-white'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold text-[#221A16]">
                        {lab.name}
                      </div>
                      <p className="text-[11px] text-[#766A65] leading-relaxed">
                        {lab.purpose}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Action Bar: Your Consultation Brief is Ready */}
          <div className="bg-[#F5EFE6] border border-[#ECE4DA] rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#221A16]">
              <Download className="w-4 h-4 text-[#8B3E42]" />
              <span>Your Deha-Chitra One-Page Consultation Brief is ready</span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={handleCopySummary}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-white hover:bg-[#FDFBF7] text-[#221A16] border border-[#ECE4DA] rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedSummary ? <CheckCheck className="w-3.5 h-3.5 text-[#4D6A5A]" /> : <Copy className="w-3.5 h-3.5 text-[#766A65]" />}
                <span>{copiedSummary ? 'Summary Copied!' : 'Copy Summary'}</span>
              </button>

              <button
                onClick={() => setShowShareModal(true)}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-white hover:bg-[#FDFBF7] text-[#221A16] border border-[#ECE4DA] rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-[#4D6A5A]" />
                <span>Send to WhatsApp / Email</span>
              </button>

              <button
                onClick={onOpenDoctorBrief}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#8B3E42] hover:bg-[#6E272C] text-white rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#FFBBBB]" />
                <span>Download PDF for Doctor</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: PCOS-Affirming Specialists */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white rounded-2xl border border-[#ECE4DA] p-6 shadow-xs space-y-5">
            
            {/* Header */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-[#4D6A5A]" />
                  <h3 className="font-serif text-lg font-semibold text-[#221A16]">
                    PCOS-Affirming Specialists
                  </h3>
                </div>
                <span className="text-[11px] text-[#4D6A5A] font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#4D6A5A]"></span>
                  18 Verified in Network
                </span>
              </div>
              <p className="text-xs text-[#766A65]">
                Clinicians trained in non-stigmatizing, root-cause hormonal diagnostics.
              </p>
            </div>

            {/* Specialty Filters */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-[#766A65] uppercase tracking-wider">
                Filter by Specialty
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['All', 'Gynecologist', 'Reproductive Endo', 'PCOS Dietitian'].map((spec) => (
                  <button
                    key={spec}
                    onClick={() => setSpecialtyFilter(spec)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                      specialtyFilter === spec
                        ? 'bg-[#8B3E42] text-white border-[#8B3E42] font-semibold'
                        : 'bg-[#F5EFE6] text-[#544342] border-[#ECE4DA] hover:bg-[#ECE4DA]'
                    }`}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>

            {/* Dropdowns for Mode & Language */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-[#766A65] uppercase">Consultation Mode</label>
                <select
                  value={modeFilter}
                  onChange={(e) => setModeFilter(e.target.value)}
                  className="w-full text-xs bg-[#FDFBF7] border border-[#ECE4DA] rounded-lg p-2 text-[#221A16] outline-none"
                >
                  <option value="All">Telehealth &amp; In-Person</option>
                  <option value="Telehealth Only">Telehealth Only</option>
                  <option value="In-Person">In-Person Clinic</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-[#766A65] uppercase">Language Spoken</label>
                <select
                  value={languageFilter}
                  onChange={(e) => setLanguageFilter(e.target.value)}
                  className="w-full text-xs bg-[#FDFBF7] border border-[#ECE4DA] rounded-lg p-2 text-[#221A16] outline-none"
                >
                  <option value="All">All Languages</option>
                  <option value="Hindi">English &amp; Hindi</option>
                  <option value="Tamil">Tamil &amp; English</option>
                  <option value="Bengali">Bengali &amp; English</option>
                </select>
              </div>
            </div>

            {/* Specialist Cards */}
            <div className="space-y-4 pt-1">
              {filteredDoctors.slice(0, 3).map((doctor) => (
                <div
                  key={doctor.id}
                  className="bg-[#FDFBF7] border border-[#ECE4DA] rounded-xl p-4 space-y-3 hover:border-[#8B3E42]/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={doctor.avatarUrl}
                        alt={doctor.name}
                        className="w-11 h-11 rounded-full object-cover border border-[#ECE4DA]"
                      />
                      <div>
                        <h4 className="font-serif text-sm font-semibold text-[#221A16]">
                          {doctor.name}
                        </h4>
                        <p className="text-[11px] text-[#766A65]">
                          {doctor.role} • {doctor.experienceYears} yrs exp
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-[#8B3E42] font-semibold">
                      <Star className="w-3.5 h-3.5 fill-[#8B3E42]" />
                      <span>{doctor.rating}</span>
                      <span className="text-[10px] text-[#766A65]">({doctor.reviewCount})</span>
                    </div>
                  </div>

                  {/* Doctor Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {doctor.tags.map((t, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-[#EDF2EE] text-[#4D6A5A] font-medium">
                        {t}
                      </span>
                    ))}
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F5EFE6] text-[#766A65]">
                      {doctor.languages.join(', ')}
                    </span>
                  </div>

                  {/* Slot & Book CTA */}
                  <div className="pt-2 border-t border-[#ECE4DA]/70 flex items-center justify-between">
                    <div className="text-[11px] text-[#766A65] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#4D6A5A]" />
                      <span>Next: <strong className="text-[#221A16] font-medium">{doctor.nextSlot}</strong></span>
                    </div>

                    <button
                      onClick={() => onSelectDoctorForBooking(doctor)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#8B3E42] hover:bg-[#6E272C] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                      Book Consultation
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* View all vetted link */}
            <div className="pt-2 text-center">
              <button
                onClick={() => onSelectTab('find-care')}
                className="text-xs font-semibold text-[#8B3E42] hover:underline cursor-pointer"
              >
                View all 18 vetted clinical practitioners &rarr;
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Bottom Section: What If You Feel Dismissed in the Exam Room? */}
      <div className="bg-[#F5EFE6] border border-[#ECE4DA] rounded-2xl p-6 sm:p-8 space-y-6">
        
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8B3E42] uppercase tracking-wider">
            <MessageSquare className="w-4 h-4" />
            <span>Advocacy Scripts &amp; Boundary Setting</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#221A16]">
            What If You Feel Dismissed in the Exam Room?
          </h3>
          <p className="text-xs sm:text-sm text-[#544342] leading-relaxed">
            Up to 70% of women report feeling unheard during initial reproductive consultations. You are entitled to complete lab evaluations and respectful, root-cause clinical investigations. Use these polite yet unyielding scripts if faced with standard dismissals:
          </p>
        </div>

        {/* 3 Script Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {DISMISSAL_SCRIPTS.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-xl border border-[#ECE4DA] p-5 flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div className="space-y-3">
                <div className="text-[11px] font-bold text-[#8B3E42] tracking-wide uppercase leading-tight">
                  {item.trigger}
                </div>
                <p className="font-serif italic text-xs sm:text-[13px] text-[#221A16] leading-relaxed">
                  {item.script}
                </p>
              </div>

              <div className="pt-3 border-t border-[#ECE4DA]/70 flex items-center justify-between text-[11px]">
                {item.goal ? (
                  <span className="text-[#4D6A5A] font-medium leading-tight">
                    {item.goal}
                  </span>
                ) : (
                  <span className="text-[#766A65] italic leading-tight">
                    {item.note}
                  </span>
                )}
                <button
                  onClick={() => handleCopy(item.id, item.script)}
                  className="shrink-0 p-1.5 text-[#766A65] hover:text-[#8B3E42] transition-colors"
                  title="Copy advocacy script"
                >
                  {copiedId === item.id ? <CheckCheck className="w-3.5 h-3.5 text-[#4D6A5A]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Share Modal Dialog */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#ECE4DA] max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h4 className="font-serif text-lg font-bold text-[#221A16]">
                Share Consultation Brief
              </h4>
              <button onClick={() => setShowShareModal(false)} className="text-[#766A65] hover:text-[#221A16]">
                ✕
              </button>
            </div>
            <p className="text-xs text-[#544342]">
              Send your synthesized Deha-Chitra briefing directly to your own phone via WhatsApp or copy formatted notes for an upcoming email to your provider:
            </p>
            <div className="space-y-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Deha-Chitra Consultation Brief:\n${cyclePattern}\nSymptoms: ${physicalTags.join(', ')}\nLabs: ${selectedLabs.join(', ')}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-[#25D366] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Open in WhatsApp</span>
              </a>
              <button
                onClick={() => {
                  handleCopySummary();
                  setShowShareModal(false);
                }}
                className="w-full py-2.5 px-4 bg-[#F5EFE6] text-[#221A16] rounded-xl text-xs font-semibold hover:bg-[#ECE4DA] transition-colors"
              >
                Copy Full Email Text
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
