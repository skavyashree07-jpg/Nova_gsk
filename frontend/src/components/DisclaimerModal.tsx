import React from 'react';
import { X, ShieldCheck, Lock, HeartHandshake, BookOpen } from 'lucide-react';

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-[#ECE4DA] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-[#FDFBF7] px-6 py-4 border-b border-[#ECE4DA] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#4D6A5A]" />
            <span className="font-serif text-lg font-semibold text-[#221A16]">
              Clinical Disclaimer &amp; Privacy Architecture
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[#766A65] hover:text-[#221A16]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-5 text-xs text-[#544342] leading-relaxed max-h-[80vh] overflow-y-auto">
          
          <div className="p-4 bg-[#FBF2F2] border border-[#8B3E42]/20 rounded-xl space-y-1.5 text-[#31202B]">
            <div className="font-semibold text-xs text-[#8B3E42] uppercase tracking-wider flex items-center gap-1.5">
              <span>Non-Diagnostic Boundary</span>
            </div>
            <p className="text-xs">
              Deha-Chitra (देह-चित्र) is an educational, self-advocacy translation tool designed to assist patients in communicating nuanced sensations with healthcare professionals. It does not provide formal medical diagnoses, clinical prescriptions, or individualized medical treatments.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-serif text-sm font-semibold text-[#221A16] flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#8B3E42]" />
              <span>International Evidence Base (Rotterdam 2023)</span>
            </h4>
            <p>
              All anatomical translations, phenotype archetypes, and investigative laboratory panels reference the <em>2023 International Evidence-based Guidelines for the Assessment and Management of Polycystic Ovary Syndrome (PCOS)</em>, published collaboratively by Monash University, the Endocrine Society, ESHRE, and ASRM.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-serif text-sm font-semibold text-[#221A16] flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-[#4D6A5A]" />
              <span>Zero-Tracking In-Browser Privacy</span>
            </h4>
            <p>
              Your personal symptom descriptions, cycle timelines, and voice intake transcripts are processed strictly within your local browser runtime. Deha-Chitra never stores personal health identifiers or sells health telemetry to third-party data brokers.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-serif text-sm font-semibold text-[#221A16] flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-[#8B3E42]" />
              <span>Specialist Directory Standards</span>
            </h4>
            <p>
              Practitioners listed in the Deha-Chitra sanctuary directory have pledged to adhere to trauma-informed, weight-inclusive, and root-cause endocrine standards. Consultation fees and availability are set directly by each respective clinic or telehealth provider.
            </p>
          </div>

          <div className="pt-3 border-t border-[#ECE4DA] flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-[#8B3E42] text-white rounded-xl font-semibold text-xs hover:bg-[#6E272C] transition-colors cursor-pointer"
            >
              I Understand &amp; Agree
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
