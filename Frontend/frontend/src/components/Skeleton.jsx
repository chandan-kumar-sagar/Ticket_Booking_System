import React from "react";

export const Skeleton = ({ className = "" }) => {
  return <div className={`animate-pulse rounded-lg bg-gray-200/80 ${className}`} />;
};

export const SkeletonText = ({ lines = 3, className = "" }) => {
  const safeLines = Math.max(1, Number(lines) || 1);
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: safeLines }).map((_, i) => (
        <Skeleton
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          className={`h-3 ${i === safeLines - 1 ? "w-2/3" : "w-full"}`}
        />
      ))}
    </div>
  );
};

export const SkeletonStatsGrid = ({ items = 4, className = "" }) => {
  const count = Math.max(1, Number(items) || 1);
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          className="bg-white/70 backdrop-blur rounded-3xl border border-white/60 p-5 shadow-sm"
        >
          <Skeleton className="h-3 w-28 rounded-md" />
          <Skeleton className="mt-4 h-9 w-16 rounded-xl" />
        </div>
      ))}
    </div>
  );
};

export const SkeletonCardGrid = ({ items = 6, className = "" }) => {
  const count = Math.max(1, Number(items) || 1);
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          className="flex flex-col justify-between p-7 bg-white rounded-3xl shadow-md shadow-gray-200/50 border border-gray-100 relative overflow-hidden"
        >
          <div>
            <Skeleton className="h-7 w-2/3 rounded-xl" />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-gray-50/80 border border-gray-100 px-4 py-3">
                <Skeleton className="h-3 w-20 rounded-md" />
                <Skeleton className="mt-2 h-5 w-16 rounded-lg" />
              </div>
              <div className="rounded-2xl bg-gray-50/80 border border-gray-100 px-4 py-3">
                <Skeleton className="h-3 w-20 rounded-md" />
                <Skeleton className="mt-2 h-5 w-20 rounded-lg" />
              </div>
            </div>
          </div>
          <Skeleton className="mt-8 h-12 w-full rounded-xl" />
        </div>
      ))}
    </div>
  );
};

export const SkeletonTable = ({ rows = 6, cols = 4, className = "" }) => {
  const r = Math.max(1, Number(rows) || 1);
  const c = Math.max(1, Number(cols) || 1);
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-100 text-gray-400 uppercase text-xs tracking-wider">
            {Array.from({ length: c }).map((_, i) => (
              <th
                // eslint-disable-next-line react/no-array-index-key
                key={i}
                className="pb-4 px-4 font-bold"
              >
                <Skeleton className="h-3 w-24 rounded-md" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {Array.from({ length: r }).map((_, i) => (
            <tr
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              className="bg-white"
            >
              {Array.from({ length: c }).map((__, j) => (
                <td
                  // eslint-disable-next-line react/no-array-index-key
                  key={j}
                  className="py-4 px-4"
                >
                  <Skeleton className="h-4 w-full max-w-[240px] rounded-md" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const SkeletonTicketList = ({ items = 3, className = "" }) => {
  const count = Math.max(1, Number(items) || 1);
  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          className="relative overflow-hidden bg-white p-7 rounded-3xl shadow-md shadow-gray-200/50 border border-gray-100"
        >
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-violet-200 to-indigo-200" />
          <div className="pl-4">
            <Skeleton className="h-3 w-40 rounded-md" />
            <Skeleton className="mt-4 h-6 w-2/3 rounded-xl" />
            <Skeleton className="mt-3 h-10 w-56 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const SkeletonSeatGrid = ({ className = "" }) => {
  return (
    <div
      className={`flex flex-col items-center gap-6 p-8 bg-white/50 backdrop-blur-sm rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 ${className}`}
    >
      <div className="w-full max-w-2xl text-center mb-10">
        <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-violet-200 to-transparent rounded-full opacity-60" />
        <div className="text-[10px] font-bold tracking-[0.4em] uppercase text-gray-300 mt-4 select-none">
          Loading seats
        </div>
      </div>
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3 sm:gap-4 justify-center w-full">
        {Array.from({ length: 60 }).map((_, i) => (
          <Skeleton
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-t-2xl rounded-b-md"
          />
        ))}
      </div>
      <div className="flex gap-6 mt-6 pt-6 border-t border-gray-100/80 w-full justify-center">
        <Skeleton className="h-5 w-24 rounded-lg" />
        <Skeleton className="h-5 w-24 rounded-lg" />
        <Skeleton className="h-5 w-24 rounded-lg" />
      </div>
    </div>
  );
};

