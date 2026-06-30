export const RARITY_STYLES: Record<string, { bg: string; text: string; border?: string }> = {
    "Common": { bg: "bg-[#F0EEF8]", text: "text-[#4A4270]" },
    "Uncommon": { bg: "bg-[#E4EFF8]", text: "text-[#1F5280]" },
    "Rare": { bg: "bg-[#EAEAEA]", text: "text-[#2A2A2A]" },
    "Double rare": { bg: "bg-[#E8E8E8]", text: "text-[#2A2A2A]" },
    "Illustration rare": { bg: "bg-[#EAF3E8]", text: "text-[#1E6030]" },
    "Ultra Rare": { bg: "bg-[#EAF0F8]", text: "text-[#1A4A8A]" },
    "Mega Attack Rare": { bg: "bg-[#FCE8F3]", text: "text-[#8A2060]" },
    "Special illustration rare": { bg: "bg-[#FDF4DC]", text: "text-[#7A5000]", border: "border border-[#E8C84A]" },
    "Mega Hyper Rare": { bg: "bg-[#FDF0C0]", text: "text-[#7A5800]", border: "border border-[#D4A800]" },
    "Unknown": { bg: "bg-lavender", text: "text-heather" },
};

export function getRarityStyle(rarity?: string) {
    if (!rarity) return RARITY_STYLES["Unknown"];
    return RARITY_STYLES[rarity] ?? RARITY_STYLES["Unknown"];
}

export const TYPE_STYLES: Record<string, { bg: string; text: string }> = {
  "Fire": { bg: "bg-[#FEF0CC]", text: "text-[#B84000]" },
  "Water": { bg: "bg-[#DFF0FF]", text: "text-[#0D5A9E]" },
  "Grass": { bg: "bg-[#E4F5E0]", text: "text-[#1E6B2E]" },
  "Lightning": { bg: "bg-[#FEF5CC]", text: "text-[#8A6400]" },
  "Psychic": { bg: "bg-[#F5E8F8]", text: "text-[#7A1E8A]" },
  "Fighting": { bg: "bg-[#F5EBE0]", text: "text-[#8A3A10]" },
  "Darkness": { bg: "bg-[#EAF0E8]", text: "text-[#1E2E20]" },
  "Metal": { bg: "bg-[#EEF0F5]", text: "text-[#3A4A5A]" },
  "Dragon": { bg: "bg-[#FCE8F3]", text: "text-[#6A1060]" },
  "Fairy": { bg: "bg-[#FFF0E8]", text: "text-[#A03060]" },
  "Colorless": { bg: "bg-[#F0F0F0]", text: "text-[#4A4A4A]" },
  "Unknown": { bg: "bg-lavender", text: "text-heather" },
};

export function getTypeStyle(type?: string) {
    if (!type) return TYPE_STYLES["Unknown"];
    return TYPE_STYLES[type] ?? TYPE_STYLES["Unknown"];
}