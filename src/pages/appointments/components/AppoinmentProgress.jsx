import React from "react";
import { Check, User, Car, Wrench, XCircle, UserCheck, Phone, Mail } from "lucide-react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import './AppointmentProgress.css';

const baseStages = [
  { label: "Pending", statusMsg: "Waiting for booking confirmation" },
  { label: "Booked", statusMsg: "Appointment confirmed" },
  { label: "Arrived", statusMsg: "Vehicle is at the shop" },
  { label: "Assessment", statusMsg: "Technician is evaluating the vehicle" },
  { label: "In Progress", statusMsg: "Service/Repair currently being performed" },
  { label: "Completed", statusMsg: "Ready for pickup" },
];

const AppointmentProgress = ({ appointment }) => {
  if (!appointment) return null;

  const isCanceled = appointment.status === "Canceled";
  
  const currentStages = isCanceled 
    ? [...baseStages, { label: "Canceled", statusMsg: "This appointment has been canceled" }] 
    : baseStages;

  const currentIndex = currentStages.findIndex(s => 
    s.label === appointment.status || 
    (s.label === "Arrived" && appointment.status === "Vehicle Arrived")
  );
  
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;
  const vehicle = appointment.vehicle || appointment.vehicleDetails || appointment.car || {};
  const assignedStaff = appointment.assignedStaff || null;

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

      {/* Vehicle & Customer Contact Section */}
      <div className="info-card bg-slate-50 border-slate-200">
        <div className="info-section">
          <div className="info-icon-wrapper text-[#1D2D43] shadow-sm">
            <Car size={20} />
          </div>
          <div>
            <p className="text-slate-500 uppercase font-bold text-[10px] mb-1">Vehicle Details</p>
            
            {/* Vehicle Name */}
            <p className="text-[#1D2D43] font-bold text-sm">
              {vehicle.brand} {vehicle.model}
            </p>

            {/* Year */}
            <p className="text-xs text-slate-500 mb-1">
              {vehicle.year}
            </p>

            {/* ✅ NEW: PLATE NUMBER (highlighted) */}
            <Badge className="bg-[#1D2D43] text-white text-[10px] px-2 py-1">
              Plate: {vehicle.year} • {
                vehicle.licensePlate || 
                vehicle.plateNumber || 
                vehicle.plate || 
                vehicle.plate_no || 
                "No Plate"
              }
            </Badge>
          </div>
        </div>
        
        <div className="hidden md:block w-px h-12 bg-slate-200" />

        <div className="info-section">
          <div className="info-icon-wrapper text-[#1D2D43] shadow-sm">
            <User size={20} />
          </div>
          <div className="flex-1">
            <p className="text-slate-500 uppercase font-bold text-[10px] mb-1">Customer Contact</p>
            <p className="text-[#1D2D43] font-bold text-sm mb-1">{appointment.name || "Guest User"}</p>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-slate-600">
                <Phone size={12} />
                <a href={`tel:${appointment.phone}`} className="text-[11px] font-medium hover:text-[#1D2D43] underline decoration-slate-300 underline-offset-2">
                  {appointment.phone || "No Phone"}
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Mail size={12} />
                <a href={`mailto:${appointment.email}`} className="text-[11px] font-medium hover:text-[#1D2D43] truncate max-w-[140px]">
                  {appointment.email || "No Email"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Visualization */}
      <div className="progress-container">
        <div className="progress-track">
          <div className="line-base"></div>
          <div 
            className={`line-fill transition-all duration-700 ${isCanceled ? 'bg-red-500' : 'bg-green-500'}`} 
            style={{ width: `${(activeIndex / (currentStages.length - 1)) * 100}%` }}
          ></div>

          <div className="steps-wrapper">
            {currentStages.map((stage, index) => {
              const isPast = index < activeIndex;
              const isCurrent = index === activeIndex;
              
              let circleStyles = "step-circle transition-all duration-500 ";
              let content = null;

              if (isPast) {
                circleStyles += isCanceled ? "bg-red-500 border-red-500 text-white" : "bg-green-500 border-green-500 text-white";
                content = <Check size={18} strokeWidth={3} />;
              } else if (isCurrent) {
                circleStyles += isCanceled 
                    ? "border-red-500 text-red-500 bg-white shadow-sm" 
                    : "border-[#1D2D43] text-[#1D2D43] bg-white shadow-sm scale-110";
                content = isCanceled ? <XCircle size={22} strokeWidth={2.5} /> : <span className="text-xs font-bold">{index + 1}</span>;
              } else {
                circleStyles += "bg-white text-slate-300 border-slate-200";
                content = <span className="text-xs font-bold">{index + 1}</span>;
              }

              return (
                <div key={index} className={`step-item ${isCurrent ? 'active' : ''}`}>
                  <div className={circleStyles}>
                    {content}
                  </div>
                  <div className="step-content">
                    <p className={`step-label font-extrabold text-[10px] ${isPast ? (isCanceled ? 'text-red-500' : 'text-green-600') : isCurrent ? (isCanceled ? 'text-red-500' : 'text-[#1D2D43]') : 'text-slate-400'}`}>
                      {stage.label}
                    </p>
                    {appointment.timestamps?.[index] && (
                       <p className="step-time">
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

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2 mb-3">
            <Wrench size={16} className="text-[#1D2D43]" />
            <span className="text-sm font-bold text-[#1D2D43]">Service Summary</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {appointment.services?.map((s, i) => (
              <Badge key={i} className="bg-white text-[#1D2D43] border-slate-200 text-[10px] font-semibold">
                {s?.service?.name || "Standard Check"}
              </Badge>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2 mb-3">
            <UserCheck size={16} className="text-[#1D2D43]" />
            <span className="text-sm font-bold text-[#1D2D43]">Assigned Mechanic</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#1D2D43]/10 flex items-center justify-center text-[#1D2D43] font-bold text-xs">
              {assignedStaff?.name ? assignedStaff.name.charAt(0) : "T"}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">{assignedStaff?.name || "Unassigned"}</p>
              <p className="text-[10px] text-slate-500">{assignedStaff?.role || "Technician"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Status Footer */}
      <div className={`current-status-box border-l-4 p-4 rounded-r-lg ${isCanceled ? 'bg-red-50 border-red-500' : 'bg-green-50 border-green-500'}`}>
        <div className="flex items-center gap-3">
          <div className={`h-2 w-2 rounded-full animate-pulse ${isCanceled ? 'bg-red-500' : 'bg-green-500'}`}></div>
          <p className={`text-sm ${isCanceled ? 'text-red-700' : 'text-green-800'}`}>
            <span className="font-bold">Live Status:</span> {currentStages[activeIndex]?.statusMsg}
          </p>
        </div>
      </div>
    </DialogContent>
  );
};

export default AppointmentProgress;