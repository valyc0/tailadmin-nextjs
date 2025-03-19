"use client";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80">
      <div className="w-16 h-16 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
    </div>
  );
}