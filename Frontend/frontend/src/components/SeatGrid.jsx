import React from "react";
import { SkeletonSeatGrid } from "./Skeleton";

const SeatGrid = ({ seats, selectedSeats, onSelectSeat, loading = false }) => {
  const safeSeats = Array.isArray(seats) ? seats : [];
  const currentUserId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  if (loading) {
    return <SkeletonSeatGrid />;
  }
  // If seats are missing
  if (safeSeats.length === 0) {
    return (
      <div className="flex items-center justify-center p-12 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
        <p className="text-gray-500 font-medium">No seats available right now.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-white/50 backdrop-blur-sm rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50">
      
      {/* Screen Graphic Design */}
      <div className="w-full max-w-2xl text-center mb-10">
        <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-violet-400 to-transparent rounded-full opacity-60 shadow-[0_4px_24px_rgba(167,139,250,0.6)]"></div>
        <div className="text-[10px] font-bold tracking-[0.4em] uppercase text-gray-400 mt-4 select-none">
          Screen
        </div>
      </div>

      {/* Grid Container (dynamically configures columns based on typical theater logic) */}
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3 sm:gap-4 justify-center perspective-[1000px]">
        {safeSeats.map((seat) => {
          const isSelected = selectedSeats.includes(seat._id);
          const isAvailable = seat.status === "AVAILABLE";
          const reservedByMe =
            seat.status === "RESERVED" &&
            currentUserId &&
            String(seat.reservedBy) === String(currentUserId);
          const isUnavailable =
            seat.status === "BOOKED" ||
            (seat.status === "RESERVED" && !reservedByMe && !isSelected);

          return (
            <button
              key={seat._id}
              type="button"
              disabled={isUnavailable}
              onClick={() => onSelectSeat(seat._id)}
              aria-label={`Seat ${seat.seatNumber}`}
              className={`
                group relative w-10 h-10 sm:w-12 sm:h-12 rounded-t-2xl rounded-b-md transition-all duration-300 shadow-sm
                flex items-center justify-center text-xs sm:text-sm font-semibold
                ${
                  isSelected 
                    ? "bg-violet-600 text-white shadow-violet-500/40 ring-4 ring-violet-600/20 translate-y-[1px]" 
                    : isUnavailable
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-70" 
                      : "bg-white text-gray-600 hover:bg-violet-50 hover:text-violet-600 border border-gray-200 hover:border-violet-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-200/50"
                }
              `}
            >
              <span className={isSelected ? "drop-shadow-md" : ""}>{seat.seatNumber}</span>
              
              {/* Floating Tooltip for Status (Visible on hover when disabled) */}
              {isUnavailable && (
                <div className="absolute -top-10 bg-gray-900/90 backdrop-blur-sm text-white text-[10px] px-2.5 py-1.5 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-all scale-95 group-hover:scale-100 whitespace-nowrap shadow-lg z-10">
                  {seat.status}
                  {/* Tooltip triangle */}
                  <div className="absolute w-2 h-2 bg-gray-900/90 rotate-45 -bottom-1 left-1/2 -translate-x-1/2"></div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Status Legend */}
      <div className="flex gap-6 mt-6 pt-6 border-t border-gray-100/80 w-full justify-center">
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-t-lg rounded-b-sm bg-white border border-gray-300 shadow-sm"></div>
          <span className="text-sm font-medium text-gray-600">Available</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-t-lg rounded-b-sm bg-violet-600 shadow-sm shadow-violet-500/40"></div>
          <span className="text-sm font-medium text-gray-600">Selected</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-t-lg rounded-b-sm bg-gray-200 border border-gray-200/50"></div>
          <span className="text-sm font-medium text-gray-600">Unavailable</span>
        </div>
      </div>

    </div>
  );
};

export default SeatGrid;
