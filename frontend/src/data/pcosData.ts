import {
  SubtypeDossier,
  SymptomCheckItem,
  LabMarker,
  TerminologyMapping,
  DoctorSpecialist
} from '../types';

export const INSPIRATION_PROMPTS = [
  {
    lang: 'en',
    text: "Periods come once in 3-4 months & sudden chin hair"
  },
  {
    lang: 'hi',
    text: "अनियमित पीरियड्स और चेहरे पर अनचाहे बाल"
  },
  {
    lang: 'en',
    text: "Feeling bloated, heavy fatigue and weight won't budge"
  },
  {
    lang: 'en',
    text: "Crushing anxiety before periods and dark velvety skin on neck"
  },
  {
    lang: 'en',
    text: "Period has not returned 6 months after stopping oral contraceptive pills"
  },
  {
    lang: 'hinglish',
    text: "Periods bahut irregular hain, hair fall ho raha hai aur neck pe dark patches hain"
  }
];

export const PCOS_SUBTYPES: SubtypeDossier[] = [
  {
    id: 'insulin-resistant',
    patternNumber: 'PATTERN 01',
    prevalence: '~70% of Cases',
    title: 'Insulin-Resistant PCOS',
    subheading: 'Hyperinsulinemia & glucose clearance',
    badge: 'Metabolic Driver',
    frequency: 'Primary frequency: 65% – 75% of presentations',
    statusTag: 'Cellular Receptor Blockade',
    everydaySignals: [
      'Intense sugar & carbohydrate crashes within 2 hours of dining',
      'Central adiposity (disproportionate midsection weight retention)',
      'Skin tags (neck, underarms) and velvety skin darkening (Acanthosis Nigricans)',
      'Brain fog and persistent afternoon energy valleys'
    ],
    labTests: [
      {
        testName: 'Fasting Insulin + Glucose',
        description: 'To calculate HOMA-IR ratio (ideal fasting insulin is < 7–8 µIU/mL)'
      },
      {
        testName: 'HbA1c & 2-Hour OGTT',
        description: 'Measures 90-day glycemic trends and dynamic post-load insulin clearance'
      },
      {
        testName: 'Comprehensive Lipid Panel',
        description: 'Triglyceride-to-HDL ratio (> 2.0 frequently correlates with insulin resistance)'
      }
    ],
    clinicalQuestions: [
      '"My fasting glucose was normal, but my intense afternoon cravings and midsection distribution suggest cellular insulin resistance. Can we run a fasting insulin and HOMA-IR calculation?"',
      '"What are your views on combining inositol (40:1 Myo to D-Chiro) or insulin-sensitizing approaches with structured protein-first meal pacing?"'
    ]
  },
  {
    id: 'inflammatory',
    patternNumber: 'PATTERN 02',
    prevalence: 'Systemic',
    title: 'Inflammatory PCOS',
    subheading: 'Immune activation & gut axis',
    badge: 'Immune Driver',
    frequency: 'Secondary frequency: 15% – 20% of presentations',
    statusTag: 'Systemic Cytokine Signaling',
    everydaySignals: [
      'Painful, deep cystic acne along the lower jawline and neck',
      'Unexplained joint aches, morning stiffness, and chronic diffuse fatigue',
      'Frequent gut bloating, reactive food sensitivities, or IBS symptoms',
      'Frequent headaches, environmental allergies, or eczema flares'
    ],
    labTests: [
      {
        testName: 'High-Sensitivity CRP (hs-CRP)',
        description: 'Quantifies subtle subclinical systemic inflammation (ideal is < 1.0 mg/L)'
      },
      {
        testName: 'Fasting Ferritin & ESR',
        description: 'Assesses acute-phase inflammatory storage proteins and erythrocyte sedimentation'
      },
      {
        testName: 'Vitamin D3 (25-OH)',
        description: 'Essential immune-regulatory steroid hormone; deficiency amplifies ovarian inflammatory cascades'
      }
    ],
    clinicalQuestions: [
      '"Given my persistent jawline cystic breakouts and gastrointestinal bloating, could subclinical chronic inflammation be driving ovarian androgen production?"',
      '"Can we evaluate an anti-inflammatory dietary protocol and test hs-CRP alongside standard reproductive hormones?"'
    ]
  },
  {
    id: 'adrenal',
    patternNumber: 'PATTERN 03',
    prevalence: '~10% of Cases',
    title: 'Adrenal PCOS',
    subheading: 'HPA axis & DHEA-S elevation',
    badge: 'Neuroendocrine Driver',
    frequency: 'Focused frequency: 8% – 12% of presentations',
    statusTag: 'Sympathetic HPA Surge',
    everydaySignals: [
      '"Tired-but-wired" sleep pattern; struggle falling asleep despite physical exhaustion',
      'Elevated heart rate, pronounced startle response, and generalized anxiety',
      'Diffuse hair shedding across the scalp without elevated ovarian testosterone',
      'Extreme sensitivity to caffeine, skipping meals, or high-intensity interval training'
    ],
    labTests: [
      {
        testName: 'DHEA-S (Dehydroepiandrosterone Sulfate)',
        description: 'Exclusive biomarker of adrenal androgen secretion; often isolated high while ovarian testosterone is normal'
      },
      {
        testName: 'Morning Cortisol & ACTH',
        description: 'Evaluates hypothalamic-pituitary-adrenal axis baseline and adrenal responsiveness'
      },
      {
        testName: '17-Hydroxyprogesterone (17-OHP)',
        description: 'Essential diagnostic step to rule out Non-Classic Congenital Adrenal Hyperplasia (NCAH)'
      }
    ],
    clinicalQuestions: [
      '"Because my physical symptoms surge during periods of chronic stress, can we specifically evaluate DHEA-S rather than just total testosterone?"',
      '"Could we assess my HPA axis and rule out non-classic adrenal hyperplasia with a morning 17-OHP test?"'
    ]
  },
  {
    id: 'post-pill',
    patternNumber: 'PATTERN 04',
    prevalence: 'Transient',
    title: 'Post-Pill PCOS',
    subheading: 'Rebound androgen receptor surge',
    badge: 'Transitional Driver',
    frequency: 'Transient state: typically 3 – 12 months after OCP cessation',
    statusTag: 'Receptor Upregulation Rebound',
    everydaySignals: [
      'Normal, predictable cycles prior to beginning hormonal contraceptives',
      'Sudden eruption of cystic acne or hair loss 3 to 6 months after discontinuing the pill',
      'Menstrual cycle fails to resume past 90 days (secondary amenorrhea)',
      'Severe withdrawal mood swings and unpredictable breast tenderness'
    ],
    labTests: [
      {
        testName: 'LH to FSH Ratio (Day 3 of bleed)',
        description: 'Evaluates whether hypothalamic pulsatile release of GnRH has normalized'
      },
      {
        testName: 'Total Testosterone & SHBG',
        description: 'Sex Hormone-Binding Globulin often plummets post-pill, temporarily releasing unbound free testosterone'
      },
      {
        testName: 'Serum Prolactin & TSH',
        description: 'Crucial exclusion markers for post-pill hyperprolactinemia or subclinical thyroid slowdown'
      }
    ],
    clinicalQuestions: [
      '"My cycles were regular before birth control; could my current lack of ovulation be a temporary post-pill endocrine rebound rather than classical PCOS?"',
      '"What is an evidence-supported nutritional protocol to replenish B-vitamins, zinc, and support my body while the hypothalamic-pituitary-ovarian axis wakes up?"'
    ]
  }
];

export const SYMPTOM_CHECK_ITEMS: SymptomCheckItem[] = [
  // Metabolic / Energy
  { id: 'm1', category: 'metabolic', label: 'Post-meal sugar & carbohydrate crashes' },
  { id: 'm2', category: 'metabolic', label: 'Weight retention centered at abdomen' },
  { id: 'm3', category: 'metabolic', label: 'Small skin tags or darker velvety patches' },
  // Immune / Inflammatory
  { id: 'i1', category: 'immune', label: 'Painful cystic acne along jaw/neck' },
  { id: 'i2', category: 'immune', label: 'Chronic gut bloating, IBS, or bowel changes' },
  { id: 'i3', category: 'immune', label: 'Unexplained joint aches or physical fatigue' },
  // Adrenal / Stress
  { id: 'a1', category: 'adrenal', label: "'Tired-but-wired' sleep disruption" },
  { id: 'a2', category: 'adrenal', label: 'Pronounced startle response & anxiety' },
  { id: 'a3', category: 'adrenal', label: 'Diffuse hair shedding without high testosterone' },
  // Cycle History
  { id: 'c1', category: 'cycle', label: 'Cycles were normal before hormonal contraception' },
  { id: 'c2', category: 'cycle', label: 'Symptoms erupted within 6 months of stopping' },
  { id: 'c3', category: 'cycle', label: 'Period has not resumed past 90 days' }
];

export const PRESET_TERMINOLOGY_MAPPINGS: TerminologyMapping[] = [
  {
    id: 't1',
    everyday: "My periods are super weird and random",
    clinical: "My cycle length fluctuates between 42 and 65 days with intermittent follicular spotting.",
    clinicalCategory: "Oligomenorrhea & Anovulation"
  },
  {
    id: 't2',
    everyday: "I'm exhausted and craving sugar non-stop",
    clinical: "I experience severe post-prandial lethargy, reactive hypoglycemic episodes, and metabolic hunger spikes.",
    clinicalCategory: "Impaired Glucose Dynamics"
  },
  {
    id: 't3',
    everyday: "I keep getting coarse chin hair",
    clinical: "I note progressive terminal hair growth on the mandibular area, suggesting clinical hyperandrogenism.",
    clinicalCategory: "Clinical Hyperandrogenism"
  },
  {
    id: 't4',
    everyday: "My weight went up 15 pounds even though I eat clean",
    clinical: "I experience progressive refractory adiposity disproportionate to caloric intake, consistent with hyperinsulinemia-mediated lipogenesis.",
    clinicalCategory: "Metabolic Inflexibility"
  },
  {
    id: 't5',
    everyday: "I feel anxious and my heart races when I try to sleep",
    clinical: "I experience nocturnal hyperarousal, impaired sleep latency, and sympathetic nervous system dysregulation, suggestive of HPA-axis overdrive.",
    clinicalCategory: "Adrenal & Autonomic Dysregulation"
  }
];

export const MUST_ASK_LAB_PANEL: LabMarker[] = [
  {
    id: 'testosterone',
    name: 'Total & Free Testosterone',
    purpose: 'Assesses circulating active androgens',
    rationale: 'Elevated free testosterone confirms hyperandrogenism (one of three key Rotterdam criteria).',
    selected: true,
    recommended: true,
    optimalRange: 'Free: 0.5 – 2.0 pg/mL | Total: 15 – 45 ng/dL'
  },
  {
    id: 'dhea-s',
    name: 'DHEA-S',
    purpose: 'Evaluates adrenal-driven androgen production',
    rationale: 'Distinguishes between ovarian androgen production and adrenal stress-axis overdrive.',
    selected: true,
    recommended: true,
    optimalRange: 'Age-dependent: 120 – 280 µg/dL'
  },
  {
    id: 'fasting-insulin',
    name: 'Fasting Insulin & Glucose Ratio',
    purpose: 'Detects subclinical insulin resistance',
    rationale: 'Fasting glucose alone misses 80% of early insulin resistance; fasting insulin below 7 µIU/mL is optimal.',
    selected: true,
    recommended: true,
    optimalRange: 'Fasting Insulin: < 7.0 µIU/mL | HOMA-IR: < 1.4'
  },
  {
    id: 'lh-fsh',
    name: 'LH : FSH Ratio (Day 3)',
    purpose: 'Hormonal axis ratio (>2:1 often indicative)',
    rationale: 'Luteinizing Hormone elevated relative to Follicle-Stimulating Hormone impairs dominant follicle selection.',
    selected: true,
    recommended: true,
    optimalRange: 'Approx 1:1 on cycle Day 2–4'
  },
  {
    id: 'pelvic-ultrasound',
    name: 'Pelvic Ultrasound (Antral Follicles)',
    purpose: 'Assesses ovarian morphology & follicle count',
    rationale: 'Evaluates the presence of ≥20 follicles per ovary or ovarian volume >10 mL per 2023 international guidelines.',
    selected: true,
    recommended: true,
    optimalRange: '<20 antral follicles per ovary, volume <10ml'
  },
  {
    id: 'tsh-t3-t4',
    name: 'TSH & Free T3/T4 (Rule-Out)',
    purpose: 'Rules out primary hypothyroid symptom overlap',
    rationale: 'Hypothyroidism closely mimics PCOS symptoms including delayed cycles, hair thinning, and sluggish metabolism.',
    selected: true,
    recommended: true,
    optimalRange: 'TSH: 1.0 – 2.2 µIU/mL | Free T3: 3.0 – 3.8 pg/mL'
  },
  {
    id: 'prolactin',
    name: 'Serum Prolactin',
    purpose: 'Rules out hyperprolactinemia causes for anovulation',
    rationale: 'Mild pituitary prolactin elevations can suppress normal gonadotropin pulsatility and halt menstrual periods.',
    selected: true,
    recommended: true,
    optimalRange: '< 20 ng/mL (non-pregnant)'
  }
];

export const VETTED_DOCTORS: DoctorSpecialist[] = [
  {
    id: 'doc-1',
    name: 'Dr. Ananya Sen, MD',
    qualification: 'MD (OB/GYN), Fellowship in Reproductive Endocrinology',
    role: 'Reproductive Endocrinologist',
    experienceYears: 12,
    rating: 4.9,
    reviewCount: 112,
    tags: ['Non-weight-stigmatizing', 'Root-cause focus'],
    languages: ['Hindi', 'English'],
    modes: ['Telehealth', 'In-Person'],
    location: 'South Delhi & Pan-India Telehealth',
    nextSlot: 'Tomorrow, 3:30 PM',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813580-b21915998a1c?auto=format&fit=crop&w=256&q=80',
    bio: 'Dedicated to unhurried, evidence-based reproductive care. Specializes in metabolic and adrenal PCOS profiling with non-shaming clinical discussions.',
    fee: '₹1,500 / 30-min intake'
  },
  {
    id: 'doc-2',
    name: 'Dr. Priya Narang, DGO',
    qualification: 'DGO, DNB (Obstetrics & Gynecology)',
    role: 'Adolescent & Adult PCOS Specialist',
    experienceYears: 9,
    rating: 4.8,
    reviewCount: 94,
    tags: ['Listens & validates', 'Adolescent health'],
    languages: ['Tamil', 'English'],
    modes: ['Telehealth', 'In-Person'],
    location: 'Chennai & Pan-India Telehealth',
    nextSlot: 'Friday, 11:00 AM',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=256&q=80',
    bio: 'Known for validating patient concerns and ordering comprehensive lab panels rather than solely prescribing contraceptive band-aids.',
    fee: '₹1,200 / 30-min intake'
  },
  {
    id: 'doc-3',
    name: 'Meera Krishnan, RD',
    qualification: 'M.Sc. Clinical Nutrition, Certified PCOS Educator',
    role: 'Metabolic & Fertility Nutritionist',
    experienceYears: 7,
    rating: 5.0,
    reviewCount: 86,
    tags: ['Anti-diet approach', 'Gentle nutrition'],
    languages: ['Hindi', 'English', 'Malayalam'],
    modes: ['Telehealth'],
    location: 'Bengaluru & Global Telehealth',
    nextSlot: 'Monday, 2:00 PM',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    bio: 'Focuses on intuitive eating, glucose stabilization without restrictive dieting, and evidence-grounded nutraceuticals for PCOS.',
    fee: '₹1,000 / 45-min consultation'
  },
  {
    id: 'doc-4',
    name: 'Dr. Shalini Ghosh, MD',
    qualification: 'MD (General Medicine), DM (Endocrinology)',
    role: 'Consultant Endocrinologist',
    experienceYears: 15,
    rating: 4.9,
    reviewCount: 148,
    tags: ['Metabolic specialist', 'HOMA-IR expert'],
    languages: ['Bengali', 'Hindi', 'English'],
    modes: ['Telehealth', 'In-Person'],
    location: 'Kolkata & Telehealth',
    nextSlot: 'Thursday, 4:00 PM',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=256&q=80',
    bio: 'Pioneer in insulin-sensitization therapy and comprehensive hormonal workups for women facing recurrent metabolic stalls.',
    fee: '₹1,800 / 30-min intake'
  },
  {
    id: 'doc-5',
    name: 'Dr. Radhika Varma, MBBS, MS',
    qualification: 'MS (OB/GYN), Fellow of Indian College of Obstetricians',
    role: 'Integrative Gynecologist',
    experienceYears: 11,
    rating: 4.9,
    reviewCount: 120,
    tags: ['Hormone balance', 'Holistic evidence'],
    languages: ['English', 'Hindi', 'Marathi'],
    modes: ['Telehealth', 'In-Person'],
    location: 'Mumbai & Pan-India Telehealth',
    nextSlot: 'Wednesday, 10:30 AM',
    avatarUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=256&q=80',
    bio: 'Integrates compassionate gynecological exams with comprehensive thyroid, adrenal, and ovarian profiling.',
    fee: '₹1,600 / 30-min intake'
  }
];

export const DISMISSAL_SCRIPTS = [
  {
    id: 'birth-control',
    trigger: 'IF TOLD: "JUST TAKE BIRTH CONTROL TO REGULATE YOUR CYCLE"',
    script: '"I understand oral contraceptives can induce a monthly withdrawal bleed, but I would like to identify what is biochemically driving my irregular ovulation before masking it. Can we order the Day-3 hormone panel and fasting insulin first?"',
    goal: 'Goal: Focus on root-cause diagnosis over symptom suppression.',
    category: 'Symptom Suppression'
  },
  {
    id: 'weight-loss',
    trigger: 'IF TOLD: "JUST LOSE 10% OF YOUR BODY WEIGHT AND IT WILL RESOLVE"',
    script: '"Because insulin resistance directly impedes fat oxidation in PCOS, I need objective metabolic labs before starting another restrictive diet. Could we check my fasting insulin-to-glucose ratio to see if metabolic support is indicated?"',
    goal: 'Goal: Shifts blame from willpower to cellular metabolism.',
    category: 'Weight Bias'
  },
  {
    id: 'refusal-documentation',
    trigger: 'IF A REQUESTED TEST IS FLATLY DECLINED: THE DOCUMENTATION SCRIPT',
    script: '"I respect your clinical recommendation; however, if you are declining to order the total/free testosterone or fasting insulin tests today, could you please document in my visit notes that I requested these specific markers and the clinical reason they were withheld?"',
    note: 'Note: Physicians frequently reconsider and order requested lab panels when required to formally chart their refusal.',
    category: 'Test Access Advocacy'
  }
];
