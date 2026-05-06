"use client";

export default function StickyAppCTA() {
  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 p-3 flex items-center justify-between gap-3 bg-foreground text-background">
      <div className="flex items-center gap-2 text-sm font-medium">
        <span>Track calories free with Oatmeal</span>
      </div>
      <a
        href="https://apps.apple.com/app/oatmeal-calorie-tracker"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-full shrink-0 hover:bg-primary/90 transition-colors"
      >
        Get App
      </a>
    </div>
  );
}
