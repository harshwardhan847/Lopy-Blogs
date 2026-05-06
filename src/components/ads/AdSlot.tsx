"use client";

interface AdSlotProps {
  type?: "adsense" | "custom" | "none";
  adClient?: string;
  adSlot?: string;
  className?: string;
  /** Custom app name for promo banner */
  appName?: string;
  appStoreUrl?: string;
}

export default function AdSlot({
  type = "none",
  adClient,
  adSlot,
  className = "",
  appName = "Oatmeal",
  appStoreUrl = "https://apps.apple.com/app/oatmeal-calorie-tracker",
}: AdSlotProps) {
  if (type === "adsense") {
    return (
      <div className={`ad-slot ${className}`}>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={adClient ?? process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
          data-ad-slot={adSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  if (type === "custom") {
    return (
      <a
        href={appStoreUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center gap-4 rounded-xl p-4 ${className}`}
        style={{
          background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)",
          color: "#fff",
          textDecoration: "none",
        }}
      >
        <span className="text-3xl">🥣</span>
        <div>
          <p className="font-bold text-sm">{appName} – Free Calorie Tracker</p>
          <p className="text-xs opacity-90 mt-0.5">
            Track meals, scan barcodes &amp; hit your goals
          </p>
        </div>
        <span
          className="ml-auto text-xs font-semibold bg-white rounded-full px-3 py-1"
          style={{ color: "var(--color-primary)" }}
        >
          Free ↗
        </span>
      </a>
    );
  }

  // type === 'none' — render an empty placeholder for future ads
  return (
    <div className={`ad-slot ${className}`}>
      <span>Ad</span>
    </div>
  );
}
