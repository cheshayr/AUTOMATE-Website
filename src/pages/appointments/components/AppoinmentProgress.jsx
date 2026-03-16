import React from "react";
import { Check, User, Car, Clock, ShieldCheck, Wrench, ClipboardList } from "lucide-react";
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import './AppointmentProgress.css';

const stages = [
  { label: "Pending", statusMsg: "Waiting for booking confirmation" },
  { label: "Booked", statusMsg: "Appointment confirmed" },
  { label: "Arrived", statusMsg: "Vehicle is at the shop" },
  { label: "Assessment", statusMsg: "Technician is evaluating the vehicle" },
  { label: "In Progress", statusMsg: "Service/Repair currently being performed" },
  { label: "Completed", statusMsg: "Ready for pickup" },
];

const AppointmentProgress = ({ appointment, onClose }) => {
  if (!appointment) return null;

  // Logic to handle naming inconsistencies between DB and UI
  const currentIndex = stages.findIndex(s => 
    s.label === appointment.status || 
    (s.label === "Arrived" && appointment.status === "Vehicle Arrived")
  );
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;
  const vehicle = appointment.vehicle || {};

  return (
    <DialogContent className="appointment-progress-dialog bg-white border-none shadow-2xl">
      <DialogHeader>
        <div className="flex justify-between items-center">
          <DialogTitle className="text-2xl font-bold text-[#1D2D43]">Service Tracker</DialogTitle>
          <Badge variant="outline" className="border-[#1D2D43] text-[#1D2D43] px-3 py-1">
            Ref: {appointment.refNo || "N/A"}
          </Badge>
        </div>
      </DialogHeader>

      {/* Primary Info Card */}
      <div className="info-card bg-slate-50 border-slate-200">
        <div className="info-section">
          <div className="info-icon-wrapper text-[#1D2D43]">
            <Car size={20} />
          </div>
          <div>
            <p className="info-label text-slate-500 uppercase font-bold text-[10px]">Vehicle Details</p>
            <p className="info-value text-[#1D2D43] font-semibold">
              {vehicle.brand} {vehicle.model} <span className="text-slate-400 font-normal">({vehicle.year})</span>
            </p>
          </div>
        </div>
        
        <div className="info-divider bg-slate-200" />

        <div className="info-section">
          <div className="info-icon-wrapper text-[#1D2D43]">
            <User size={20} />
          </div>
          <div>
            <p className="info-label text-slate-500 uppercase font-bold text-[10px]">Assigned Customer</p>
            <p className="info-value text-[#1D2D43] font-semibold">{appointment.name || "Guest User"}</p>
          </div>
        </div>
      </div>

      {/* Progress Visualization */}
      <div className="progress-container">
        <div className="progress-track">
          <div className="line-base bg-slate-200"></div>
          <div 
            className="line-fill bg-[#1D2D43]" 
            style={{ width: `${(activeIndex / (stages.length - 1)) * 100}%` }}
          ></div>

          <div className="steps-wrapper">
            {stages.map((stage, index) => {
              const isCompleted = index < activeIndex;
              const isCurrent = index === activeIndex;
              
              return (
                <div key={index} className={`step-item ${isCurrent ? 'active' : ''}`}>
                  <div className={`step-circle transition-all duration-500 
                    ${isCompleted ? 'bg-[#1D2D43] border-[#1D2D43] text-white' : ''} 
                    ${isCurrent ? 'border-[#1D2D43] text-[#1D2D43] bg-white ring-4 ring-[#1D2D43]/10 scale-110' : 'bg-white text-slate-300 border-slate-200'}`}>
                    {isCompleted ? (
                      <Check size={18} strokeWidth={3} />
                    ) : (
                      <span className="text-xs font-bold">{index + 1}</span>
                    )}
                  </div>
                  <div className="step-content">
                    <p className={`step-label text-[11px] font-bold ${isCurrent || isCompleted ? 'text-[#1D2D43]' : 'text-slate-400'}`}>
                      {stage.label}
                    </p>
                    {appointment.timestamps?.[index] && (
                       <p className="step-time text-[9px] text-slate-500 mt-1">
                        {format(new Date(appointment.timestamps[index]), "h:mm a")}
                       </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detailed Service Specs - THE ADDED DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2 mb-2">
            <Wrench size={16} className="text-[#1D2D43]" />
            <span className="text-sm font-bold text-[#1D2D43]">Service Summary</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {appointment.services?.map((s, i) => (
              <Badge key={i} variant="secondary" className="bg-white text-[#1D2D43] border-slate-200 text-[10px]">
                {s?.service?.name || "Standard Check"}
              </Badge>
            )) || <span className="text-xs text-slate-400 italic">No services listed</span>}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck size={16} className="text-[#1D2D43]" />
            <span className="text-sm font-bold text-[#1D2D43]">Technician Notes</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {appointment.notes?.staffNotes || "Initial assessment is underway. Please wait for the technician's full report."}
          </p>
        </div>
      </div>

      {/* Footer Status Message */}
      <div className="current-status-box bg-[#1D2D43]/5 border-l-4 border-[#1D2D43] p-4 rounded-r-lg">
        <div className="flex items-center gap-3">
          <div className="status-indicator h-2 w-2 rounded-full bg-[#1D2D43] animate-pulse"></div>
          <p className="text-sm text-[#1D2D43]">
            <span className="font-bold">Live Status:</span> {stages[activeIndex]?.statusMsg}
          </p>
        </div>
      </div>

      <DialogFooter>
        <Button 
          onClick={onClose} 
          className="w-full bg-[#1D2D43] hover:bg-[#2a3f5a] text-white font-bold py-6 rounded-xl"
        >
          Return to Dashboard
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default AppointmentProgress;