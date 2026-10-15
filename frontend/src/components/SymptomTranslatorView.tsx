import React, { useEffect, useRef, useState } from 'react';
import { NavigationTab, LanguageCode } from '../types';
import { analyzeSymptoms, CareServiceError, checkCareService, type SymptomAnalysis } from '../lib/api';
import { INSPIRATION_PROMPTS } from '../data/pcosData';
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  ArrowRight, 
  Lock, 
  RotateCcw, 
  Info, 
  FileText, 
  ShieldCheck, 
  Layers,
  HeartHandshake, 
} from 'lucide-react';

interface SymptomTranslatorViewProps {
  onSelectTab: (tab: NavigationTab) => void;
  selectedLanguage: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
}

export const SymptomTranslatorView: React.FC<SymptomTranslatorViewProps> = ({
  onSelectTab,
  selectedLanguage,
  onSelectLanguage,
}) => {
  const [statement, setStatement] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [hasTranslated, setHasTranslated] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<SymptomAnalysis | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [serviceReady, setServiceReady] = useState<boolean | null>(null);
  const [speechFeedback, setSpeechFeedback] = useState<string>('Ready to listen • English / Hindi / Tamil / Kannada');
  const analysisRequestId = useRef(0);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);

  const updateStatement = (text: string) => {
    analysisRequestId.current += 1;
    setStatement(text);
    setIsTranslating(false);
    setHasTranslated(false);
    setAnalysis(null);
    setAnalysisError(null);
  };

  useEffect(() => {
    let active = true;
    checkCareService()
      .then(() => {
        if (active) setServiceReady(true);
      })
      .catch(() => {
        if (active) setServiceReady(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    analysisRequestId.current += 1;
    setIsTranslating(false);
    setHasTranslated(false);
    setAnalysis(null);
    setAnalysisError(null);
  }, [selectedLanguage]);

  const handleSelectInspiration = (promptText: string) => {
    setStatement(promptText);
    void triggerTranslation(promptText);
  };

  const triggerTranslation = async (customText = statement) => {
    const text = customText.trim();
    if (!text) return;
    const requestId = ++analysisRequestId.current;
    setIsTranslating(true);
    setHasTranslated(false);
    setAnalysis(null);
    setAnalysisError(null);
    try {
      const result = await analyzeSymptoms(text, selectedLanguage);
      if (analysisRequestId.current !== requestId) return;
      setAnalysis(result);
      setHasTranslated(true);
      setServiceReady(true);
    } catch (error) {
      if (analysisRequestId.current !== requestId) return;
      setAnalysisError(error instanceof Error ? error.message : 'Unable to analyze this description.');
      setServiceReady(error instanceof CareServiceError ? error.reachable : true);
    } finally {
      if (analysisRequestId.current === requestId) setIsTranslating(false);
    }
  };

  // Use browser speech recognition when available; typed input remains the fallback.
  const toggleVoiceIntake = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      recognitionRef.current = null;
      setIsListening(false);
      setSpeechFeedback('Ready to listen • English / Hindi / Tamil / Kannada');
      return;
    }

    const SpeechRecognition = 
      (window as unknown as { SpeechRecognition?: any }).SpeechRecognition || 
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = getSpeechLanguage();

        recognition.onstart = () => {
          setIsListening(true);
          setSpeechFeedback('Listening carefully... speak your natural words');
        };

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((res: any) => res[0].transcript)
            .join('');
          updateStatement(transcript);
        };

        recognition.onerror = () => {
          recognitionRef.current = null;
          setIsListening(false);
          setSpeechFeedback('Voice intake paused. Feel free to type or tap inspiration prompts.');
        };

        recognition.onend = () => {
          recognitionRef.current = null;
          setIsListening(false);
          setSpeechFeedback('Finished listening. Click Translate to process signals.');
        };

        recognitionRef.current = recognition;
        recognition.start();
        return;
      } catch {
        setSpeechFeedback('Voice capture could not start. Please type your description instead.');
        return;
      }
    }

    setSpeechFeedback('Speech recognition is not available in this browser. Please type your description instead.');
  };

  const currentConcepts = analysis?.normalise.concepts ?? [];
  const matchedSpans = analysis?.normalise.matched_spans ?? [];
  const triage = analysis?.triage;
  const inputLanguages: { code: LanguageCode; label: string; speechCode: string }[] = [
    { code: 'en', label: 'English', speechCode: 'en-US' },
    { code: 'hi', label: 'Hindi (हिन्दी)', speechCode: 'hi-IN' },
    { code: 'hinglish', label: 'Hinglish', speechCode: 'hi-IN' },
    { code: 'ta', label: 'Tamil (தமிழ்)', speechCode: 'ta-IN' },
    { code: 'kn', label: 'Kannada (ಕನ್ನಡ)', speechCode: 'kn-IN' },
  ];
  const getSpeechLanguage = () => inputLanguages.find((language) => language.code === selectedLanguage)?.speechCode ?? 'en-US';
  const formatConcept = (concept: string) =>
    concept.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const careTone = triage?.care_level === 'emergency' || triage?.care_level === 'urgent'
    ? 'border-[#BA1A1A]/30 bg-[#FFF5F4] text-[#8B1D1D]'
    : 'border-[#C7E7D3] bg-[#EDF2EE] text-[#304D3E]';

  return (
    <div className="space-y-12 pb-16">
      
      {/* Top Empathetic Sanctuary Banner */}
      <div className="flex justify-start">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EDF2EE] border border-[#C7E7D3] text-[#304D3E] text-xs font-semibold tracking-wide">
          <span className="w-2 h-2 rounded-full bg-[#4D6A5A] animate-pulse"></span>
          <span>🌿 Empathetic Clinical Sanctuary • Reviewed with Women's Health &amp; OB/GYN Specialists</span>
        </div>
      </div>

      {/* Hero Title & Subtitle */}
      <div className="max-w-4xl space-y-4">
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-normal tracking-tight text-[#221A16] leading-[1.18]">
          A gentle space to understand <br className="hidden sm:inline" />
          <span className="italic font-serif">what your body is whispering.</span>
        </h1>
        <p className="font-sans text-base sm:text-lg text-[#544342] leading-relaxed max-w-3xl">
          Share your feelings, cycle shifts, skin changes, or sensations in everyday words or your
          mother tongue. The care service looks for symptom concepts and offers educational guidance—
          never a diagnosis.
        </p>
      </div>

      {/* Main Dual Intake Container (Text & Voice) */}
      <div className="bg-white rounded-2xl border border-[#ECE4DA] p-5 sm:p-7 shadow-[0_2px_14px_-2px_rgba(49,32,43,0.04)]">
        
        {/* Top Header Indicators */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#ECE4DA]/70 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4D6A5A]"></span>
            <span className="text-sm font-semibold text-[#221A16] font-sans">
              Describe your sensations, cycle shifts, or energy changes
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#766A65]">Selected Input Mode:</span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
              serviceReady === false ? 'bg-[#FFF5F4] text-[#8B1D1D]' : 'bg-[#EDF2EE] text-[#4D6A5A]'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${serviceReady === false ? 'bg-[#BA1A1A]' : 'bg-[#4D6A5A]'}`}></span>
              {serviceReady === null ? 'Checking care service…' : serviceReady ? 'Care service connected' : 'Care service unavailable'}
            </span>
          </div>
        </div>

        {/* Input & Voice Intake Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5">
          
          {/* Left Column: Text Area & Inspiration Chips */}
          <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
            
            {/* The Input Textarea */}
            <div className="relative rounded-xl border border-[#D9CDC1] bg-[#FDFBF7] p-3.5 focus-within:border-[#8B3E42] focus-within:ring-2 focus-within:ring-[#8B3E42]/10 transition-all">
              <textarea
                value={statement}
                onChange={(e) => {
                updateStatement(e.target.value);
                }}
                placeholder="Type in your own words, e.g. 'My periods are unpredictable, getting unexpected chin hairs, and extreme sugar crashes...'"
                rows={4}
                maxLength={4000}
                className="w-full bg-transparent resize-none border-none outline-none text-[#221A16] placeholder-[#766A65]/70 text-base leading-relaxed font-sans"
              />
              <div className="flex items-center justify-between pt-2 border-t border-[#ECE4DA]/70 text-xs text-[#766A65]">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#4D6A5A]" />
                  <span>Strictly confidential • Private in-browser session</span>
                </div>
                {statement && (
                  <button
                    onClick={() => {
                      updateStatement('');
                    }}
                    className="hover:text-[#8B3E42] transition-colors font-medium cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Inspiration Chips */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-[#766A65] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#8B3E42]" />
                <span>Need inspiration? Tap everyday descriptions:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {INSPIRATION_PROMPTS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectInspiration(item.text)}
                    className="text-left text-xs bg-[#F5EFE6] hover:bg-[#FBF2F2] hover:text-[#8B3E42] hover:border-[#8B3E42]/40 text-[#544342] px-3 py-1.5 rounded-full border border-[#ECE4DA] transition-all cursor-pointer"
                  >
                    "{item.text}"
                  </button>
                ))}
              </div>
            </div>

            {/* Input Language Selectors */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs text-[#766A65] font-medium mr-1">Input Language:</span>
              {inputLanguages.map((lang) => {
                const isActive = selectedLanguage === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      analysisRequestId.current += 1;
                      setIsTranslating(false);
                      setHasTranslated(false);
                      setAnalysis(null);
                      setAnalysisError(null);
                      onSelectLanguage(lang.code);
                    }}
                    className={`text-xs px-3 py-1 rounded-full transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#8B3E42] text-white font-semibold shadow-xs'
                        : 'bg-[#F5EFE6] text-[#544342] hover:bg-[#ECE4DA]'
                    }`}
                  >
                    {lang.label}
                  </button>
                );
              })}
            </div>

          </div>

          {/* Right Column: Voice Intake Card & Visualizer */}
          <div className="lg:col-span-4 flex flex-col justify-between bg-[#FDFBF7] border border-[#ECE4DA] rounded-xl p-5 space-y-4">
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#221A16]">Voice Intake</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#EDF2EE] text-[#4D6A5A] font-medium">
                      Supported languages
                </span>
              </div>
              <p className="text-xs text-[#544342] leading-relaxed">
                Speak in English, Hindi, Hinglish, Tamil, or Kannada when your browser supports speech recognition.
              </p>
            </div>

            {/* Audio Wave Visualizer Box */}
            <div className="bg-white rounded-xl border border-[#ECE4DA] p-4 flex flex-col items-center justify-center space-y-3 min-h-[90px]">
              <div className="flex items-center justify-center gap-1.5 h-8">
                <span className={`w-1.5 bg-[#4D6A5A] rounded-full ${isListening ? 'animate-wave-1' : 'h-3'}`}></span>
                <span className={`w-1.5 bg-[#8B3E42] rounded-full ${isListening ? 'animate-wave-2' : 'h-5'}`}></span>
                <span className={`w-1.5 bg-[#4D6A5A] rounded-full ${isListening ? 'animate-wave-3' : 'h-7'}`}></span>
                <span className={`w-1.5 bg-[#8B3E42] rounded-full ${isListening ? 'animate-wave-4' : 'h-4'}`}></span>
                <span className={`w-1.5 bg-[#4D6A5A] rounded-full ${isListening ? 'animate-wave-5' : 'h-6'}`}></span>
                <span className={`w-1.5 bg-[#8B3E42] rounded-full ${isListening ? 'animate-wave-6' : 'h-2'}`}></span>
              </div>
              <span className="text-[11px] font-medium text-[#766A65] tracking-wide text-center">
                {speechFeedback}
              </span>
            </div>

            {/* Voice Capture Button */}
            <button
              onClick={toggleVoiceIntake}
              className={`w-full py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isListening
                  ? 'bg-[#BA1A1A] text-white shadow-md animate-pulse'
                  : 'bg-[#F5EFE6] hover:bg-[#FBF2F2] hover:text-[#8B3E42] text-[#544342] border border-[#ECE4DA]'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-3.5 h-3.5" />
                  <span>Listening... Tap to finish</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5 text-[#8B3E42]" />
                  <span>Speak in your mother tongue</span>
                </>
              )}
            </button>

          </div>

        </div>

        {/* Big Action Button: Translate & Understand My Signals */}
        <div className="pt-6 border-t border-[#ECE4DA]/60 mt-6 flex justify-end">
          <button
            onClick={() => void triggerTranslation()}
            disabled={!statement.trim() || isTranslating}
            className="w-full sm:w-auto px-7 py-3.5 bg-[#8B3E42] hover:bg-[#6E272C] disabled:bg-[#8B3E42]/50 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <RotateCcw className={`w-4 h-4 ${isTranslating ? 'animate-spin' : ''}`} />
            <span>{isTranslating ? 'Checking symptoms with the care service…' : 'Check symptoms & care guidance'}</span>
          </button>
        </div>

        {analysisError && (
          <div role="alert" className="mt-4 rounded-xl border border-[#BA1A1A]/30 bg-[#FFF5F4] p-4 text-sm text-[#8B1D1D]">
            <p className="font-semibold">Unable to analyze this description.</p>
            <p className="mt-1">{analysisError}</p>
          </div>
        )}

      </div>

      {/* Synthesized Translation & Hallmarks Section */}
      {hasTranslated && (
        <section className="space-y-6 pt-2">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#ECE4DA] pb-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8B3E42] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Backend symptom matching</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#221A16] font-medium mt-1">
                Your matched symptoms &amp; care guidance
              </h2>
            </div>
            <div className="text-xs text-[#766A65]">
              Educational information only · Not a diagnosis
            </div>
          </div>

          {/* 2-Column Synthesis Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Natural statement & Identified Clinical Concepts */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Natural language quote block */}
              <div className="bg-[#FFFFFF] border border-[#ECE4DA] rounded-2xl p-6 relative">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#8B3E42] uppercase tracking-wider mb-2">
                  <span className="font-serif text-2xl leading-none text-[#8B3E42]">“</span>
                  <span>Your Natural Language Statement</span>
                </div>
                <p className="font-serif italic text-lg sm:text-xl text-[#221A16] leading-relaxed">
                  "{statement}"
                </p>
              </div>

              {/* Identified Clinical Concepts */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#766A65] uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-[#4D6A5A]" />
                  <span>Identified Clinical Concepts (Non-Diagnostic)</span>
                </div>

                <div className="space-y-3.5">
                  {currentConcepts.map((concept) => {
                    const matches = matchedSpans.filter((span) => span.concept === concept);
                    return (
                    <div 
                      key={concept}
                      className="bg-white rounded-xl border border-[#ECE4DA] p-5 shadow-xs hover:border-[#8B3E42]/40 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-serif text-base font-semibold text-[#8B3E42]">
                              {formatConcept(concept)}
                            </span>
                          </div>
                          {matches.length > 0 ? (
                            <p className="text-xs sm:text-[13px] text-[#544342] leading-relaxed">
                              Matched in your description: {matches.map((match) => `“${match.surface}” (${match.match_type})`).join(', ')}
                            </p>
                          ) : (
                            <p className="text-xs sm:text-[13px] text-[#544342] leading-relaxed">
                              Matched by the service from your description.
                            </p>
                          )}
                        </div>
                        <div className="p-2 rounded-lg bg-[#F5EFE6] text-[#766A65] shrink-0">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                    );
                  })}
                  {currentConcepts.length === 0 && (
                    <div className="rounded-xl border border-[#ECE4DA] bg-white p-5 text-sm text-[#544342]">
                      {analysis?.normalise.low_confidence
                        ? 'The service could not confidently match a symptom. This does not mean that symptoms are absent.'
                        : 'No symptom concepts were matched in this description.'}
                      {analysis && analysis.normalise.did_you_mean.length > 0 && (
                        <p className="mt-3 text-xs">
                          Possible matches: {analysis.normalise.did_you_mean.map((item) => `${formatConcept(item.concept)} (“${item.matched_phrase}”)`).join(', ')}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

            </div>

            <div className="lg:col-span-5 space-y-5">
              <div className={`rounded-2xl border p-6 space-y-3 ${careTone}`}>
                <div className="flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  <h3 className="font-serif text-xl font-semibold">
                    {triage ? formatConcept(triage.care_level) : 'Care guidance'}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed">{triage?.care_guidance}</p>
                {triage?.pattern && triage.pattern !== 'none' && !triage.pattern_suppressed && (
                  <p className="border-t border-current/15 pt-3 text-xs leading-relaxed">
                    Educational pattern strength: <strong>{formatConcept(triage.pattern)}</strong>. This is not a diagnosis.
                  </p>
                )}
              </div>

              {triage && triage.triggered_red_flags.length > 0 && (
                <div className="rounded-xl border border-[#BA1A1A]/30 bg-[#FFF5F4] p-5 text-sm text-[#8B1D1D]">
                  <h3 className="font-semibold">Urgent symptoms matched</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {triage.summary_lines.map((line, index) => <li key={`${index}-${line}`}>{line}</li>)}
                  </ul>
                </div>
              )}

              {triage && triage.doctor_questions.length > 0 && (
                <div className="rounded-2xl border border-[#ECE4DA] bg-white p-6">
                  <h3 className="font-serif text-lg font-semibold text-[#221A16]">Questions to discuss with a clinician</h3>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[#544342]">
                    {triage.doctor_questions.map((question, index) => <li key={`${index}-${question}`}>{question}</li>)}
                  </ul>
                </div>
              )}

              {triage?.disclaimer && (
                <p className="text-xs leading-relaxed text-[#766A65]">{triage.disclaimer}</p>
              )}
            </div>

          </div>

          {/* Turn Your Translated Signals Into Clear Action (3 Next Steps) */}
          <div className="pt-8 space-y-4">
            <div className="text-xs font-semibold text-[#8B3E42] uppercase tracking-wider flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5" />
              <span>Guided Next Steps</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#221A16]">
              Turn your translated signals into clear action
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
              
              {/* Card 1: Explore PCOS Subtypes */}
              <div 
                onClick={() => onSelectTab('subtypes')}
                className="bg-white rounded-2xl border border-[#ECE4DA] p-6 flex flex-col justify-between hover:shadow-md hover:border-[#8B3E42]/50 transition-all cursor-pointer group"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FBF2F2] text-[#8B3E42] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-[#221A16] group-hover:text-[#8B3E42] transition-colors">
                    Explore PCOS Subtype Patterns
                  </h3>
                  <p className="text-xs sm:text-sm text-[#544342] leading-relaxed">
                    Learn about the 4 recognizable clinical archetypes: Insulin-Resistant, Post-Pill, Inflammatory, and Adrenal PCOS to see where your profile may align.
                  </p>
                </div>
                <div className="pt-4 mt-2 text-xs font-semibold text-[#8B3E42] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>View Subtype Breakdown</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Card 2: Generate Doctor Visit Cheat Sheet */}
              <div 
                onClick={() => onSelectTab('doctor-prep')}
                className="bg-white rounded-2xl border border-[#ECE4DA] p-6 flex flex-col justify-between hover:shadow-md hover:border-[#8B3E42]/50 transition-all cursor-pointer group"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EDF2EE] text-[#4D6A5A] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-[#221A16] group-hover:text-[#8B3E42] transition-colors">
                    Generate Doctor Visit Cheat Sheet
                  </h3>
                  <p className="text-xs sm:text-sm text-[#544342] leading-relaxed">
                    Create a personalized 1-page clinical briefing for your doctor, including key lab panels to request (Fasting Insulin, Free Testosterone, DHEA-S).
                  </p>
                </div>
                <div className="pt-4 mt-2 text-xs font-semibold text-[#8B3E42] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Build My Appointment Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Card 3: Find a PCOS-Affirming Specialist */}
              <div 
                onClick={() => onSelectTab('find-care')}
                className="bg-white rounded-2xl border border-[#ECE4DA] p-6 flex flex-col justify-between hover:shadow-md hover:border-[#8B3E42]/50 transition-all cursor-pointer group"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F5EFE6] text-[#766A65] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <HeartHandshake className="w-5 h-5 text-[#8B3E42]" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-[#221A16] group-hover:text-[#8B3E42] transition-colors">
                    Find a PCOS-Affirming Specialist
                  </h3>
                  <p className="text-xs sm:text-sm text-[#544342] leading-relaxed">
                    Connect with vetted endocrinologists, gynecologists, and registered dietitians who listen deeply and practice evidence-based, compassionate care.
                  </p>
                </div>
                <div className="pt-4 mt-2 text-xs font-semibold text-[#8B3E42] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Search Verified Directory</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

            </div>
          </div>

        </section>
      )}

    </div>
  );
};
