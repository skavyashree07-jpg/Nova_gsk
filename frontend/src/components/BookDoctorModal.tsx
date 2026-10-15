import React, { useState } from 'react';
import { DoctorSpecialist } from '../types';
import { Calendar, Clock, Star, CheckCircle, X, ShieldCheck, MapPin } from 'lucide-react';

interface BookDoctorModalProps {
  doctor: DoctorSpecialist | null;
  onClose: () => void;
}

export const BookDoctorModal: React.FC<BookDoctorModalProps> = ({ doctor, onClose }) => {
  const [selectedDate, setSelectedDate] = useState<string>('Tomorrow');
  const [selectedTime, setSelectedTime] = useState<string>('3:30 PM');
  const [patientName, setPatientName] = useState<string>('');
  const [patientEmail, setPatientEmail] = useState<string>('');
  const [patientPhone, setPatientPhone] = useState<string>('');
  const [consultationMode, setConsultationMode] = useState<'Telehealth' | 'In-Person'>('Telehealth');
  const [attachBrief, setAttachBrief] = useState<boolean>(true);
  const [isBooked, setIsBooked] = useState<boolean>(false);

  if (!doctor) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooked(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-[#ECE4DA] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-[#FDFBF7] px-6 py-4 border-b border-[#ECE4DA] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-semibold text-[#221A16]">
              Book Consultation Prep
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[#766A65] hover:text-[#221A16]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isBooked ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#EDF2EE] text-[#4D6A5A] mx-auto flex items-center justify-center">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#221A16]">
              Consultation Requested!
            </h3>
            <p className="text-xs text-[#544342] leading-relaxed max-w-sm mx-auto">
              Your appointment request with <strong className="text-[#221A16]">{doctor.name}</strong> for <strong>{selectedDate} at {selectedTime}</strong> has been logged. A confirmation calendar invite and telehealth link has been prepared for <strong className="text-[#221A16]">{patientEmail || 'your email'}</strong>.
            </p>
            {attachBrief && (
              <div className="p-3 bg-[#F5EFE6] rounded-xl text-xs text-[#4D6A5A] font-medium flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Your Deha-Chitra clinical summary is attached for Dr. review</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 bg-[#8B3E42] text-white rounded-xl text-xs font-semibold hover:bg-[#6E272C] transition-colors cursor-pointer"
            >
              Done &amp; Return
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs text-[#221A16]">
            
            {/* Doctor mini-card */}
            <div className="flex items-center gap-3.5 p-3.5 bg-[#FDFBF7] border border-[#ECE4DA] rounded-xl">
              <img
                src={doctor.avatarUrl}
                alt={doctor.name}
                className="w-12 h-12 rounded-full object-cover border border-[#ECE4DA]"
              />
              <div className="space-y-0.5 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif text-sm font-semibold text-[#221A16]">{doctor.name}</h4>
                  <span className="text-[11px] font-semibold text-[#8B3E42]">{doctor.fee}</span>
                </div>
                <p className="text-[11px] text-[#766A65]">{doctor.role} • {doctor.experienceYears} yrs exp</p>
                <div className="flex items-center gap-1 text-[11px] text-[#4D6A5A]">
                  <MapPin className="w-3 h-3" />
                  <span>{doctor.location}</span>
                </div>
              </div>
            </div>

            {/* Mode selection */}
            <div className="space-y-1.5">
              <label className="font-semibold text-[#544342]">Consultation Mode</label>
              <div className="grid grid-cols-2 gap-2">
                {doctor.modes.map((mode) => (
                  <button
                    type="button"
                    key={mode}
                    onClick={() => setConsultationMode(mode)}
                    className={`py-2 px-3 rounded-lg border text-center transition-all cursor-pointer ${
                      consultationMode === mode
                        ? 'bg-[#8B3E42] text-white border-[#8B3E42] font-semibold'
                        : 'bg-[#FDFBF7] border-[#ECE4DA] text-[#544342]'
                    }`}
                  >
                    {mode === 'Telehealth' ? '💻 Telehealth Video' : '🏥 In-Person Clinic'}
                  </button>
                ))}
              </div>
            </div>

            {/* Slot times */}
            <div className="space-y-1.5">
              <label className="font-semibold text-[#544342]">Available Slot</label>
              <div className="grid grid-cols-3 gap-2">
                {['Tomorrow 3:30 PM', 'Friday 11:00 AM', 'Monday 2:00 PM'].map((slot) => {
                  const isSelected = selectedTime === slot;
                  return (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      className={`p-2 rounded-lg border text-[11px] text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#FBF2F2] border-[#8B3E42] text-[#8B3E42] font-semibold ring-1 ring-[#8B3E42]'
                          : 'bg-[#FDFBF7] border-[#ECE4DA] text-[#544342]'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Patient Info Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-[#544342]">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shreya Sharma"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full bg-[#FDFBF7] border border-[#D9CDC1] rounded-lg p-2.5 outline-none focus:border-[#8B3E42]"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-[#544342]">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  className="w-full bg-[#FDFBF7] border border-[#D9CDC1] rounded-lg p-2.5 outline-none focus:border-[#8B3E42]"
                />
              </div>
            </div>

            {/* Checkbox to attach brief */}
            <label className="flex items-center gap-2 p-3 bg-[#FDFBF7] border border-[#ECE4DA] rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={attachBrief}
                onChange={(e) => setAttachBrief(e.target.checked)}
                className="accent-[#8B3E42] w-4 h-4 rounded"
              />
              <span className="text-xs text-[#544342]">
                Automatically share my 1-page Deha-Chitra clinical summary with Dr. {doctor.name.split(',')[0]} before our session.
              </span>
            </label>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-[#8B3E42] hover:bg-[#6E272C] text-white rounded-xl font-semibold text-xs transition-colors cursor-pointer"
              >
                Confirm Appointment Request
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
