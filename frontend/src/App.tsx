/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NavigationTab, LanguageCode, DoctorSpecialist } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SymptomTranslatorView } from './components/SymptomTranslatorView';
import { PCOSSubtypesView } from './components/PCOSSubtypesView';
import { DoctorPrepView } from './components/DoctorPrepView';
import { FindCareView } from './components/FindCareView';
import { DoctorBriefModal } from './components/DoctorBriefModal';
import { BookDoctorModal } from './components/BookDoctorModal';
import { DisclaimerModal } from './components/DisclaimerModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('translator');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('en');
  
  // Cross-screen state: Symptoms checked in Subtypes view
  const [selectedSymptomIds, setSelectedSymptomIds] = useState<string[]>(['m1', 'm3']);
  
  // Modals state
  const [isDoctorBriefOpen, setIsDoctorBriefOpen] = useState<boolean>(false);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState<boolean>(false);
  const [bookingDoctor, setBookingDoctor] = useState<DoctorSpecialist | null>(null);

  const handleSelectTab = (tab: NavigationTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSymptom = (id: string) => {
    if (selectedSymptomIds.includes(id)) {
      setSelectedSymptomIds(selectedSymptomIds.filter((item) => item !== id));
    } else {
      setSelectedSymptomIds([...selectedSymptomIds, id]);
    }
  };

  const handleClearSymptoms = () => {
    setSelectedSymptomIds([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#221A16] font-sans antialiased">
      
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={setSelectedLanguage}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        {activeTab === 'translator' && (
          <SymptomTranslatorView
            onSelectTab={handleSelectTab}
            selectedLanguage={selectedLanguage}
            onSelectLanguage={setSelectedLanguage}
          />
        )}

        {activeTab === 'subtypes' && (
          <PCOSSubtypesView
            onSelectTab={handleSelectTab}
            selectedSymptomIds={selectedSymptomIds}
            onToggleSymptom={handleToggleSymptom}
            onClearSymptoms={handleClearSymptoms}
            onOpenDoctorBrief={() => setIsDoctorBriefOpen(true)}
          />
        )}

        {activeTab === 'doctor-prep' && (
          <DoctorPrepView
            onSelectTab={handleSelectTab}
            onOpenDoctorBrief={() => setIsDoctorBriefOpen(true)}
            onSelectDoctorForBooking={(doc) => setBookingDoctor(doc)}
          />
        )}

        {activeTab === 'find-care' && (
          <FindCareView
            onSelectTab={handleSelectTab}
            onSelectDoctorForBooking={(doc) => setBookingDoctor(doc)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectTab={handleSelectTab}
        onOpenDisclaimerModal={() => setIsDisclaimerOpen(true)}
      />

      {/* Printable Clinical 1-Page Brief Modal */}
      <DoctorBriefModal
        isOpen={isDoctorBriefOpen}
        onClose={() => setIsDoctorBriefOpen(false)}
        selectedSymptomIds={selectedSymptomIds}
      />

      {/* Doctor Appointment Booking Modal */}
      <BookDoctorModal
        doctor={bookingDoctor}
        onClose={() => setBookingDoctor(null)}
      />

      {/* Clinical Disclaimer & Methodology Modal */}
      <DisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
      />

    </div>
  );
}
