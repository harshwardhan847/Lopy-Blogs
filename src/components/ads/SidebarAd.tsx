import AdSlot from "./AdSlot";

interface SidebarAdProps {
  type?: "adsense" | "custom" | "none";
  adSlot?: string;
}

export default function SidebarAd({ type = "none", adSlot }: SidebarAdProps) {
  return (
    <div className="w-full sticky top-24">
      <AdSlot type={type} adSlot={adSlot} className="w-full min-h-[250px]" />
    </div>
  );
}
