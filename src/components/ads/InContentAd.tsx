import AdSlot from "./AdSlot";

interface InContentAdProps {
  type?: "adsense" | "custom" | "none";
  adSlot?: string;
}

export default function InContentAd({
  type = "custom",
  adSlot,
}: InContentAdProps) {
  return (
    <div className="my-8">
      <AdSlot type={type} adSlot={adSlot} className="w-full" />
    </div>
  );
}
