export type NavigationTab = 'translator' | 'subtypes' | 'doctor-prep' | 'find-care';

export type LanguageCode = 'en' | 'hi' | 'hinglish' | 'ta' | 'kn';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
}

export interface ClinicalConcept {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  definition: string;
  plainContext: string;
  iconName: 'calendar' | 'fingerprint' | 'sparkles' | 'activity' | 'shield' | 'moon' | 'zap';
}

export interface BiologicalStep {
  stepNumber: number;
  title: string;
  axis: string;
  description: string;
  iconType: 'droplet' | 'scale' | 'activity';
}

export interface BiologicalPathway {
  title: string;
  intro: string;
  steps: BiologicalStep[];
  summary: string;
  indicationNote: string;
}

export interface SubtypeDossier {
  id: string;
  patternNumber: string;
  prevalence: string;
  title: string;
  subheading: string;
  badge: string;
  frequency: string;
  statusTag: string;
  everydaySignals: string[];
  labTests: {
    testName: string;
    description: string;
  }[];
  clinicalQuestions: string[];
}

export interface SymptomCheckItem {
  id: string;
  category: 'metabolic' | 'immune' | 'adrenal' | 'cycle';
  label: string;
}

export interface LabMarker {
  id: string;
  name: string;
  purpose: string;
  rationale: string;
  selected: boolean;
  recommended: boolean;
  optimalRange?: string;
}

export interface TerminologyMapping {
  id: string;
  everyday: string;
  clinical: string;
  clinicalCategory: string;
}

export interface DoctorSpecialist {
  id: string;
  name: string;
  qualification: string;
  role: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  languages: string[];
  modes: ('Telehealth' | 'In-Person')[];
  location: string;
  nextSlot: string;
  avatarUrl: string;
  bio: string;
  fee: string;
}
