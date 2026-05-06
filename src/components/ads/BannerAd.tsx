import AdSlot from "./AdSlot";

interface BannerAdProps {
  type?: "adsense" | "custom" | "none";
  adSlot?: string;
}

export default function BannerAd({ type = "none", adSlot }: BannerAdProps) {
  return (
    <div className="w-full my-6">
      <AdSlot type={type} adSlot={adSlot} className="w-full" />
    </div>
  );
}
