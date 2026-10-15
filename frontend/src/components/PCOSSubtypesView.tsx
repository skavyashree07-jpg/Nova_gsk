import React, { useState } from 'react';
import { NavigationTab, SubtypeDossier } from '../types';
import { PCOS_SUBTYPES, SYMPTOM_CHECK_ITEMS } from '../data/pcosData';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Info, 
  Check, 
  CheckSquare, 
  Square, 
  FileText, 
  Printer, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight,
  Shield,
  Activity,
  Zap,
  Clock,
  HeartPulse,
  Plus
} from 'lucide-react';

interface PCOSSubtypesViewProps {
  onSelectTab: (tab: NavigationTab) => void;
  selectedSymptomIds: string[];
  onToggleSymptom: (id: string) => void;
  onClearSymptoms: () => void;
  onOpenDoctorBrief: () => void;
}

export const PCOSSubtypesView: React.FC<PCOSSubtypesViewProps> = ({
  onSelectTab,
  selectedSymptomIds,
  onToggleSymptom,
  onClearSymptoms,
  onOpenDoctorBrief,
}) => {
  const [selectedSubtypeId, setSelectedSubtypeId] = useState<string>('insulin-resistant');
  const [viewMode, setViewMode] = useState<'dossier' | 'matrix'>('dossier');
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [showMethodology, setShowMethodology] = useState<boolean>(false);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const activeSubtype = PCOS_SUBTYPES.find((s) => s.id === selectedSubtypeId) || PCOS_SUBTYPES[0];

  // Audio speech synthesis overview
  const toggleAudioOverview = () => {
    if (isAudioPlaying) {
      window.speechSynthesis?.cancel();
      setIsAudioPlaying(false);
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToRead = `PCOS is not one size fits all. The 4 primary drivers include Insulin Resistant PCOS, Inflammatory PCOS, Adrenal PCOS, and Post-Pill PCOS. Currently viewing ${activeSubtype.title}.`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsAudioPlaying(false);
      utterance.onerror = () => setIsAudioPlaying(false);
      setIsAudioPlaying(true);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsAudioPlaying(true);
      setTimeout(() => setIsAudioPlaying(false), 4000);
    }
  };

  const handleAddLabsToGuide = () => {
    setAddedNotice(`Added ${activeSubtype.title} lab recommendations to your Consultation Prep!`);
    setTimeout(() => setAddedNotice(null), 3000);
  };

  // Filter symptom items by category
  const metabolicItems = SYMPTOM_CHECK_ITEMS.filter((i) => i.category === 'metabolic');
  const immuneItems = SYMPTOM_CHECK_ITEMS.filter((i) => i.category === 'immune');
  const adrenalItems = SYMPTOM_CHECK_ITEMS.filter((i) => i.category === 'adrenal');
  const cycleItems = SYMPTOM_CHECK_ITEMS.filter((i) => i.category === 'cycle');

  // Generate dynamic clinical talking points
  const getGeneratedTalkingPoints = () => {
    if (selectedSymptomIds.length === 0) return null;

    const points: string[] = [];
    const hasMetabolic = selectedSymptomIds.some((id) => id.startsWith('m'));
    const hasImmune = selectedSymptomIds.some((id) => id.startsWith('i'));
    const hasAdrenal = selectedSymptomIds.some((id) => id.startsWith('a'));
    const hasCycle = selectedSymptomIds.some((id) => id.startsWith('c'));

    if (hasMetabolic) {
      points.push(
        "Discuss fasting insulin and HOMA-IR ratio to evaluate cellular insulin resistance alongside standard glycemic panels."
      );
    }
    if (hasImmune) {
      points.push(
        "Request high-sensitivity CRP (hs-CRP) and assess gastrointestinal permeability or inflammatory triggers for persistent cystic breakouts."
      );
    }
    if (hasAdrenal) {
      points.push(
        "Evaluate serum DHEA-S and morning cortisol to differentiate adrenal androgen synthesis from pure ovarian theca steroidogenesis."
      );
    }
    if (hasCycle) {
      points.push(
        "Review post-pill secondary amenorrhea timeline and evaluate LH:FSH ratio plus baseline ovarian reserve (AMH / antral follicles)."
      );
    }

    return points;
  };

  const talkingPoints = getGeneratedTalkingPoints();

  return (
    <div className="space-y-10 pb-16">
      
      {/* Breadcrumbs */}
      <nav className="text-xs text-[#766A65] flex items-center gap-1.5 font-medium">
        <button onClick={() => onSelectTab('translator')} className="hover:text-[#8B3E42]">Home</button>
        <span>&gt;</span>
        <button onClick={() => onSelectTab('translator')} className="hover:text-[#8B3E42]">Symptom Education</button>
        <span>&gt;</span>
        <span className="text-[#221A16] font-semibold">PCOS Body Signals &amp; Phenotypes</span>
      </nav>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <div className="lg:col-span-8 space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDF2EE] text-[#4D6A5A] text-xs font-semibold">
            <span>🌿 Gentle Endocrine Guidance</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[46px] font-normal text-[#221A16] leading-[1.2]">
            PCOS Is Not One-Size-Fits-All: <br className="hidden sm:inline" />
            <span className="italic font-serif">Listening to Your Body's Unique Pattern</span>
          </h1>
          <p className="font-sans text-base text-[#544342] leading-relaxed max-w-2xl">
            Your body's signals are not failures or unpredictable flaws—they are sensitive messages
            asking for support. By understanding your primary physiological driver, you can replace
            frustration with deep body literacy and advocate for the exact care and tests you deserve.
          </p>
        </div>

        {/* Right Info Box */}
        <div className="lg:col-span-4 bg-white border border-[#ECE4DA] rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8B3E42] uppercase tracking-wider">
              Phenotype Framework
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#EDF2EE] text-[#4D6A5A] font-medium">
              Evidence-Reviewed
            </span>
          </div>
          <p className="text-xs text-[#544342] leading-relaxed">
            Explore biochemical mechanisms, everyday body whispers, and specific laboratory metrics
            recommended by endocrinological consensus guidelines.
          </p>
          <div className="pt-2 border-t border-[#ECE4DA]/70 flex items-center justify-between text-xs">
            <span className="text-[#766A65]">Audio overview in 4 dialects:</span>
            <button
              onClick={toggleAudioOverview}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                isAudioPlaying
                  ? 'bg-[#BA1A1A] text-white shadow-xs animate-pulse'
                  : 'bg-[#F5EFE6] text-[#544342] hover:bg-[#FBF2F2] hover:text-[#8B3E42] border border-[#ECE4DA]'
              }`}
            >
              {isAudioPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#8B3E42]" />}
              <span>{isAudioPlaying ? 'Stop' : 'Listen'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Clinical Note Frame */}
      <div className="rounded-xl bg-[#F5EFE6] border-l-4 border-[#4D6A5A] border-y border-r border-[#ECE4DA] p-4 text-xs text-[#544342] space-y-1">
        <div className="flex items-center gap-1.5 font-semibold text-[#4D6A5A]">
          <Info className="w-4 h-4 shrink-0" />
          <span>Clinical Note &amp; Navigation Guide • Rotterdam Consensus Criteria</span>
        </div>
        <p className="leading-relaxed">
          Informational only. PCOS diagnosis requires Rotterdam Criteria validation (at least two of:
          ovulatory dysfunction, hyperandrogenism, or polycystic ovaries on pelvic sonogram)
          alongside metabolic differential exclusion evaluated by a licensed medical practitioner.
        </p>
      </div>

      {/* Subtypes Header & Selector */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ECE4DA] pb-3">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#221A16]">
              The 4 Primary Metabolic &amp; Endocrine Drivers
            </h2>
            <p className="text-xs text-[#766A65] mt-0.5">
              Select a subtype to investigate metabolic mechanisms, signature signals, and clinical inquiry scripts.
            </p>
          </div>
          <div className="flex items-center gap-1 bg-[#F5EFE6] p-1 rounded-lg border border-[#ECE4DA] text-xs">
            <span className="text-[#766A65] px-2 font-medium">View Mode:</span>
            <button
              onClick={() => setViewMode('dossier')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                viewMode === 'dossier'
                  ? 'bg-white text-[#221A16] shadow-xs'
                  : 'text-[#766A65] hover:text-[#221A16]'
              }`}
            >
              Detailed Dossier
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                viewMode === 'matrix'
                  ? 'bg-white text-[#221A16] shadow-xs'
                  : 'text-[#766A65] hover:text-[#221A16]'
              }`}
            >
              Comparison Matrix
            </button>
          </div>
        </div>

        {/* 4 Tabs / Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PCOS_SUBTYPES.map((sub) => {
            const isSelected = selectedSubtypeId === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => setSelectedSubtypeId(sub.id)}
                className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-[#8B3E42] shadow-sm ring-1 ring-[#8B3E42]'
                    : 'bg-[#FDFBF7] border-[#ECE4DA] hover:bg-white hover:border-[#D9CDC1]'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-semibold text-[#766A65] mb-1">
                  <span>{sub.patternNumber}</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-[#F5EFE6] text-[#544342]">
                    {sub.prevalence}
                  </span>
                </div>
                <div className="font-serif text-base font-semibold text-[#221A16]">
                  {sub.title.replace(' PCOS', '')}
                </div>
                <p className="text-[11px] text-[#766A65] mt-1 line-clamp-1">
                  {sub.subheading}
                </p>
              </button>
            );
          })}
        </div>

        {/* View Mode 1: Detailed Dossier Card */}
        {viewMode === 'dossier' ? (
          <div className="bg-white rounded-2xl border border-[#ECE4DA] p-6 sm:p-7 shadow-xs space-y-6">
            
            {/* Dossier Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#ECE4DA] gap-2">
              <div className="space-y-1">
                <div className="text-xs font-semibold text-[#8B3E42] tracking-wide">
                  {activeSubtype.badge} • {activeSubtype.frequency}
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#221A16]">
                  {activeSubtype.title}
                </h3>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5EFE6] text-[#544342] text-xs font-medium border border-[#ECE4DA]">
                <Activity className="w-3.5 h-3.5 text-[#8B3E42]" />
                <span>{activeSubtype.statusTag}</span>
              </div>
            </div>

            {/* Added Lab Notice */}
            {addedNotice && (
              <div className="p-3 bg-[#EDF2EE] border border-[#C7E7D3] rounded-lg text-xs font-medium text-[#304D3E] flex items-center justify-between">
                <span>{addedNotice}</span>
                <button 
                  onClick={() => onSelectTab('doctor-prep')} 
                  className="underline hover:text-[#8B3E42] font-semibold"
                >
                  View Doctor Prep &rarr;
                </button>
              </div>
            )}

            {/* 3 Column Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Column 1: Everyday Body Signals */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#221A16] uppercase tracking-wider">
                  <HeartPulse className="w-4 h-4 text-[#8B3E42]" />
                  <span>Everyday Body Signals</span>
                </div>
                <p className="text-xs text-[#766A65]">
                  When cellular mechanisms falter, the body manifests these distinct cues:
                </p>
                <div className="space-y-2.5">
                  {activeSubtype.everydaySignals.map((sig, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-[#544342] leading-relaxed">
                      <span className="w-4 h-4 rounded-full bg-[#EDF2EE] text-[#4D6A5A] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                      <span>{sig}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2: Lab Tests to Request */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#221A16] uppercase tracking-wider">
                  <FileText className="w-4 h-4 text-[#4D6A5A]" />
                  <span>Lab Tests to Request</span>
                </div>
                <p className="text-xs text-[#766A65]">
                  Standard fasting tests often miss early resistance. Discuss these dynamic markers:
                </p>
                <div className="space-y-2.5">
                  {activeSubtype.labTests.map((lab, idx) => (
                    <div key={idx} className="bg-[#FDFBF7] border border-[#ECE4DA] rounded-xl p-3 space-y-1">
                      <div className="text-xs font-semibold text-[#221A16]">
                        {lab.testName}
                      </div>
                      <p className="text-[11px] text-[#766A65] leading-relaxed">
                        {lab.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 3: Questions to Pose in Clinic */}
              <div className="space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#221A16] uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-[#8B3E42]" />
                    <span>Questions to Pose in Clinic</span>
                  </div>
                  <div className="space-y-3">
                    {activeSubtype.clinicalQuestions.map((q, idx) => (
                      <div key={idx} className="bg-[#FBF2F2] border border-[#ECE4DA] rounded-xl p-3.5 text-xs italic text-[#31202B] leading-relaxed">
                        {q}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleAddLabsToGuide}
                  className="w-full mt-4 py-2.5 px-3 bg-[#8B3E42] hover:bg-[#6E272C] text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add {activeSubtype.title.replace(' PCOS', '')} Topics to Discussion Guide</span>
                </button>
              </div>

            </div>

          </div>
        ) : (
          /* View Mode 2: Comparison Matrix */
          <div className="bg-white rounded-2xl border border-[#ECE4DA] p-6 overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead>
                <tr className="border-b border-[#ECE4DA] text-[#766A65]">
                  <th className="py-3 px-4 font-semibold uppercase">Subtype Archetype</th>
                  <th className="py-3 px-4 font-semibold uppercase">Prevalence</th>
                  <th className="py-3 px-4 font-semibold uppercase">Primary Underlying Mechanism</th>
                  <th className="py-3 px-4 font-semibold uppercase">Key Gold-Standard Labs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECE4DA]/70">
                {PCOS_SUBTYPES.map((sub) => (
                  <tr key={sub.id} className="hover:bg-[#FDFBF7]">
                    <td className="py-3.5 px-4 font-semibold text-[#221A16]">
                      {sub.title}
                    </td>
                    <td className="py-3.5 px-4 text-[#4D6A5A] font-medium">
                      {sub.prevalence}
                    </td>
                    <td className="py-3.5 px-4 text-[#544342]">
                      {sub.subheading}
                    </td>
                    <td className="py-3.5 px-4 text-[#766A65]">
                      {sub.labTests.map(l => l.testName).join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Interactive Symptom & Hormone Indicator Check-In Section */}
      <div className="bg-white rounded-2xl border border-[#ECE4DA] p-6 sm:p-7 shadow-xs space-y-6">
        
        {/* Check-In Header & Counter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#ECE4DA] gap-2">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-[#8B3E42] uppercase tracking-wider flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Self-Reflection Check-In</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#221A16]">
              Interactive Symptom &amp; Hormone Indicator Check-In
            </h3>
            <p className="text-xs text-[#766A65]">
              Select the body signals that feel true to your daily experience. As you mark items, your customized consultation summary dynamically updates below.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-full bg-[#F5EFE6] border border-[#ECE4DA] text-xs font-semibold text-[#221A16]">
              <span className="text-[#8B3E42] font-bold text-sm mr-1">{selectedSymptomIds.length}</span>
              Signals Marked
            </div>
          </div>
        </div>

        {/* 4 Category Checkboxes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Category 1: Metabolic / Energy */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#221A16]">
              <Zap className="w-3.5 h-3.5 text-[#8B3E42]" />
              <span>Metabolic / Energy</span>
            </div>
            <div className="space-y-2">
              {metabolicItems.map((item) => {
                const checked = selectedSymptomIds.includes(item.id);
                return (
                  <label
                    key={item.id}
                    onClick={() => onToggleSymptom(item.id)}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      checked
                        ? 'bg-[#FBF2F2] border-[#8B3E42] text-[#8B3E42] font-medium'
                        : 'bg-[#FDFBF7] border-[#ECE4DA] text-[#544342] hover:bg-white'
                    }`}
                  >
                    <span className="shrink-0 mt-0.5">
                      {checked ? (
                        <CheckSquare className="w-4 h-4 text-[#8B3E42]" />
                      ) : (
                        <Square className="w-4 h-4 text-[#766A65]" />
                      )}
                    </span>
                    <span className="leading-tight">{item.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Category 2: Immune / Inflammatory */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#221A16]">
              <Shield className="w-3.5 h-3.5 text-[#4D6A5A]" />
              <span>Immune / Inflammatory</span>
            </div>
            <div className="space-y-2">
              {immuneItems.map((item) => {
                const checked = selectedSymptomIds.includes(item.id);
                return (
                  <label
                    key={item.id}
                    onClick={() => onToggleSymptom(item.id)}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      checked
                        ? 'bg-[#FBF2F2] border-[#8B3E42] text-[#8B3E42] font-medium'
                        : 'bg-[#FDFBF7] border-[#ECE4DA] text-[#544342] hover:bg-white'
                    }`}
                  >
                    <span className="shrink-0 mt-0.5">
                      {checked ? (
                        <CheckSquare className="w-4 h-4 text-[#8B3E42]" />
                      ) : (
                        <Square className="w-4 h-4 text-[#766A65]" />
                      )}
                    </span>
                    <span className="leading-tight">{item.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Category 3: Adrenal / Stress */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#221A16]">
              <Activity className="w-3.5 h-3.5 text-[#55414D]" />
              <span>Adrenal / Stress</span>
            </div>
            <div className="space-y-2">
              {adrenalItems.map((item) => {
                const checked = selectedSymptomIds.includes(item.id);
                return (
                  <label
                    key={item.id}
                    onClick={() => onToggleSymptom(item.id)}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      checked
                        ? 'bg-[#FBF2F2] border-[#8B3E42] text-[#8B3E42] font-medium'
                        : 'bg-[#FDFBF7] border-[#ECE4DA] text-[#544342] hover:bg-white'
                    }`}
                  >
                    <span className="shrink-0 mt-0.5">
                      {checked ? (
                        <CheckSquare className="w-4 h-4 text-[#8B3E42]" />
                      ) : (
                        <Square className="w-4 h-4 text-[#766A65]" />
                      )}
                    </span>
                    <span className="leading-tight">{item.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Category 4: Cycle History */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#221A16]">
              <Clock className="w-3.5 h-3.5 text-[#304D3E]" />
              <span>Cycle History</span>
            </div>
            <div className="space-y-2">
              {cycleItems.map((item) => {
                const checked = selectedSymptomIds.includes(item.id);
                return (
                  <label
                    key={item.id}
                    onClick={() => onToggleSymptom(item.id)}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      checked
                        ? 'bg-[#FBF2F2] border-[#8B3E42] text-[#8B3E42] font-medium'
                        : 'bg-[#FDFBF7] border-[#ECE4DA] text-[#544342] hover:bg-white'
                    }`}
                  >
                    <span className="shrink-0 mt-0.5">
                      {checked ? (
                        <CheckSquare className="w-4 h-4 text-[#8B3E42]" />
                      ) : (
                        <Square className="w-4 h-4 text-[#766A65]" />
                      )}
                    </span>
                    <span className="leading-tight">{item.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

        </div>

        {/* Dynamic Doctor Appointment Talking Points Frame */}
        <div className="rounded-xl border border-[#ECE4DA] bg-[#FDFBF7] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#221A16]">
              <FileText className="w-4 h-4 text-[#8B3E42]" />
              <span>Your Dynamic Doctor Appointment Talking Points</span>
            </div>
            {selectedSymptomIds.length > 0 && (
              <button
                onClick={onClearSymptoms}
                className="text-xs text-[#766A65] hover:text-[#8B3E42] font-medium cursor-pointer"
              >
                Clear selections
              </button>
            )}
          </div>

          {talkingPoints ? (
            <div className="space-y-2 pt-1">
              {talkingPoints.map((point, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-[#31202B] bg-white p-3 rounded-lg border border-[#ECE4DA]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8B3E42] mt-1.5 shrink-0"></span>
                  <span className="leading-relaxed">{point}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#766A65] italic py-2">
              No body signals marked yet. Tick items above to synthesize clinical talking points and laboratory discussion topics for your practitioner.
            </p>
          )}
        </div>

      </div>

      {/* Ready to share these body signals with your doctor? Action Card */}
      <div className="bg-[#F5EFE6] border border-[#ECE4DA] rounded-2xl p-6 sm:p-8 space-y-5">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8B3E42] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Empowered Care Partnership</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#221A16]">
            Ready to share these body signals with your doctor?
          </h3>
          <p className="text-xs sm:text-sm text-[#544342] leading-relaxed">
            Transform your marked cues into an empathetic, 1-page clinical summary by Deha-Chitra.
            Includes diagnostic codes (ICD-10), symptom chronologies, and evidence-grounded lab orders
            ready to hand directly to your healthcare provider.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-1">
          <button
            onClick={() => onSelectTab('doctor-prep')}
            className="px-6 py-3.5 bg-[#8B3E42] hover:bg-[#6E272C] text-white rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4 text-[#FFBBBB]" />
            <span>Build Your Deha-Chitra Discussion Guide</span>
          </button>
          <button
            onClick={onOpenDoctorBrief}
            className="px-6 py-3.5 bg-white hover:bg-[#FDFBF7] text-[#221A16] border border-[#ECE4DA] rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#766A65]" />
            <span>Export PDF Briefing</span>
          </button>
        </div>
      </div>

      {/* Collapsible Methodology Section */}
      <div className="border border-[#ECE4DA] rounded-xl bg-white overflow-hidden">
        <button
          onClick={() => setShowMethodology(!showMethodology)}
          className="w-full p-4 flex items-center justify-between text-left text-xs font-semibold text-[#544342] hover:bg-[#FDFBF7] transition-colors"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#4D6A5A]" />
            <span>Clinical References &amp; Endocrinology Methodology</span>
          </div>
          {showMethodology ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showMethodology && (
          <div className="p-5 border-t border-[#ECE4DA] bg-[#FDFBF7] text-xs text-[#544342] space-y-3 leading-relaxed">
            <p>
              <strong>Rotterdam Consensus (2003 / Revised 2023):</strong> Diagnosis requires 2 of 3 features:
              (1) Clinical or biochemical hyperandrogenism, (2) Ovulatory dysfunction (oligomenorrhea or amenorrhea),
              and (3) Polycystic ovarian morphology (PCOM) on ultrasound (≥20 follicles per ovary or ovarian volume &gt;10 mL).
            </p>
            <p>
              <strong>International Evidence-Based Guideline (Teede et al., 2023):</strong> Endorsed by the Endocrine Society,
              ASRM, and ESHRE. Recommends metabolic screening including fasting lipid profiles, oral glucose tolerance testing,
              and calculating HOMA-IR for cardiovascular and metabolic risk stratification.
            </p>
            <p>
              <strong>Exclusionary Diagnostics:</strong> Complete differential diagnosis necessitates ruling out thyroid dysfunction (TSH),
              hyperprolactinemia (Serum Prolactin), and non-classic congenital adrenal hyperplasia (17-hydroxyprogesterone).
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
