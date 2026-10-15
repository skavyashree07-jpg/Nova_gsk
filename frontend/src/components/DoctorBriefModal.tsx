import React from 'react';
import { MUST_ASK_LAB_PANEL, PRESET_TERMINOLOGY_MAPPINGS } from '../data/pcosData';
import { Printer, Download, X, Shield, FileText, CheckCircle2 } from 'lucide-react';

interface DoctorBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSymptomIds: string[];
}

export const DoctorBriefModal: React.FC<DoctorBriefModalProps> = ({
  isOpen,
  onClose,
  selectedSymptomIds,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-[#ECE4DA] shadow-2xl overflow-hidden print-page">
        
        {/* Modal Top Actions (Hidden on Print) */}
        <div className="no-print bg-[#FDFBF7] px-6 py-4 border-b border-[#ECE4DA] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#8B3E42]" />
            <span className="font-serif text-lg font-semibold text-[#221A16]">
              Clinical Consultation Briefing (1-Page Patient Summary)
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-[#8B3E42] text-white rounded-lg text-xs font-semibold hover:bg-[#6E272C] transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#766A65] hover:text-[#221A16] hover:bg-[#F5EFE6] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* The Printable Clinical Document */}
        <div className="p-6 sm:p-10 text-[#221A16] space-y-6 text-sm font-sans bg-white">
          
          {/* Document Header */}
          <div className="flex items-start justify-between border-b-2 border-[#8B3E42] pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl font-bold tracking-tight text-[#8B3E42]">
                  DEHA-CHITRA (देह-चित्र)
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-[#EDF2EE] text-[#4D6A5A] font-semibold">
                  Patient Self-Advocacy Intake
                </span>
              </div>
              <p className="text-xs text-[#766A65] mt-1">
                Grounded in 2023 International Evidence-Based Guidelines for the Assessment and Management of PCOS
              </p>
            </div>
            <div className="text-right text-xs text-[#766A65]">
              <div>Date Generated: <strong className="text-[#221A16]">{today}</strong></div>
              <div>ICD-10 Reference: <strong className="text-[#221A16]">E28.2 (Polycystic Ovarian Syndrome)</strong></div>
            </div>
          </div>

          {/* Section 1: Chief Complaints & Clinical Terminology Translation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8B3E42] border-b border-[#ECE4DA] pb-1">
              1. Chief Complaints &amp; Physician-Recognized Equivalents
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#FDFBF7] border border-[#ECE4DA] rounded-lg space-y-1">
                <div className="text-[10px] uppercase font-semibold text-[#766A65]">Reported Symptom</div>
                <div className="text-[#544342] italic">"My periods are super unpredictable and far apart"</div>
                <div className="text-[10px] uppercase font-semibold text-[#4D6A5A] pt-1">Clinical Assessment</div>
                <div className="font-semibold text-[#221A16]">Oligomenorrhea / Chronic Anovulatory Cycles</div>
              </div>

              <div className="p-3 bg-[#FDFBF7] border border-[#ECE4DA] rounded-lg space-y-1">
                <div className="text-[10px] uppercase font-semibold text-[#766A65]">Reported Symptom</div>
                <div className="text-[#544342] italic">"Sudden dark velvety skin around the back of the neck"</div>
                <div className="text-[10px] uppercase font-semibold text-[#4D6A5A] pt-1">Clinical Assessment</div>
                <div className="font-semibold text-[#221A16]">Acanthosis Nigricans (Cutaneous Hyperinsulinemia Marker)</div>
              </div>

              <div className="p-3 bg-[#FDFBF7] border border-[#ECE4DA] rounded-lg space-y-1">
                <div className="text-[10px] uppercase font-semibold text-[#766A65]">Reported Symptom</div>
                <div className="text-[#544342] italic">"Coarse dark hair appearing along jawline and chin"</div>
                <div className="text-[10px] uppercase font-semibold text-[#4D6A5A] pt-1">Clinical Assessment</div>
                <div className="font-semibold text-[#221A16]">Terminal Hirsutism (Ferriman-Gallwey Score Assessment)</div>
              </div>

              <div className="p-3 bg-[#FDFBF7] border border-[#ECE4DA] rounded-lg space-y-1">
                <div className="text-[10px] uppercase font-semibold text-[#766A65]">Reported Symptom</div>
                <div className="text-[#544342] italic">"Severe 2 PM exhaustion and intense carbohydrate cravings"</div>
                <div className="text-[10px] uppercase font-semibold text-[#4D6A5A] pt-1">Clinical Assessment</div>
                <div className="font-semibold text-[#221A16]">Post-Prandial Reactive Hypoglycemia &amp; Metabolic Dysregulation</div>
              </div>
            </div>
          </div>

          {/* Section 2: Rotterdam Consensus Investigative Workup */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8B3E42] border-b border-[#ECE4DA] pb-1">
              2. Recommended Objective Lab Panels (Formal Order Request)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {MUST_ASK_LAB_PANEL.map((lab) => (
                <div key={lab.id} className="flex items-start gap-2 p-2 bg-[#FDFBF7] rounded border border-[#ECE4DA]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#4D6A5A] mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-[#221A16]">{lab.name}</strong>
                    <div className="text-[11px] text-[#766A65]">{lab.rationale}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Patient Care Goals & Inquiries */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8B3E42] border-b border-[#ECE4DA] pb-1">
              3. Patient Inquiry &amp; Root-Cause Discussion Goals
            </h4>
            <ul className="list-disc list-inside text-xs text-[#544342] space-y-1 leading-relaxed">
              <li>Evaluate underlying insulin sensitivity via Fasting Insulin + Glucose (HOMA-IR) prior to contraceptive masking.</li>
              <li>Differentiate ovarian hyperandrogenism from adrenal androgen output (DHEA-S evaluation).</li>
              <li>Rule out primary thyroiditis (TSH &amp; Free T3/T4) and hyperprolactinemia (Serum Prolactin).</li>
              <li>Discuss evidence-grounded non-stigmatizing management, including inositol (40:1 ratio) and protein-prioritized nutritional pacing.</li>
            </ul>
          </div>

          {/* Footer Disclaimer */}
          <div className="border-t border-[#ECE4DA] pt-4 text-[11px] text-[#766A65] leading-relaxed flex items-start gap-2">
            <Shield className="w-4 h-4 text-[#4D6A5A] shrink-0 mt-0.5" />
            <p>
              <strong>Clinical Disclosure:</strong> This document was assembled by the patient utilizing the Deha-Chitra clinical literacy engine. It is presented for shared clinical decision-making during formal consultation and does not represent an independent diagnostic conclusion.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
