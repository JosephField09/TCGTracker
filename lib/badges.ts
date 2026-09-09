export const RARITY_STYLES: Record<string, { bg: string; text: string; border?: string }> = {
    "Common": { bg: "bg-[#F0EEF8]", text: "text-[#4A4270]" },
    "Promo": { bg: "bg-[#FFF0D6]", text: "text-[#9A4B00]", border: "border border-[#E5A14C]" },
    "Uncommon": { bg: "bg-[#E4EFF8]", text: "text-[#1F5280]" },
    "Rare": { bg: "bg-[#EAEAEA]", text: "text-[#2A2A2A]" },
    "Double rare": { bg: "bg-[#E8E8E8]", text: "text-[#2A2A2A]" },
    "Holo Rare": { bg: "bg-[#E7F1FA]", text: "text-[#245A88]", border: "border border-[#9EC5E5]" },
    "Rare Holo": { bg: "bg-[#E7F1FA]", text: "text-[#245A88]", border: "border border-[#9EC5E5]" },
    "Rare Holo LV.X": { bg: "bg-[#EEE8FA]", text: "text-[#5A3C91]", border: "border border-[#B8A4E0]" },
    "Holo Rare V": { bg: "bg-[#E8EEFF]", text: "text-[#354F9A]", border: "border border-[#A9B8EF]" },
    "Holo Rare VMAX": { bg: "bg-[#F2E8FF]", text: "text-[#713BA5]", border: "border border-[#C9A9ED]" },
    "Rare PRIME": { bg: "bg-[#E7F8F5]", text: "text-[#176B63]", border: "border border-[#8DD1C7]" },
    "ACE SPEC Rare": { bg: "bg-[#FCE7EC]", text: "text-[#9B234D]", border: "border border-[#E99AAF]" },
    "Illustration rare": { bg: "bg-[#EAF3E8]", text: "text-[#1E6030]" },
    "Ultra Rare": { bg: "bg-[#EAF0F8]", text: "text-[#1A4A8A]" },
    "Mega Attack Rare": { bg: "bg-[#FCE8F3]", text: "text-[#8A2060]" },
    "Holo Rare VSTAR": { bg: "bg-[#F0E9FF]", text: "text-[#6240A0]", border: "border border-[#BBA6E8]" },
    "Special illustration rare": { bg: "bg-[#FDF4DC]", text: "text-[#7A5000]", border: "border border-[#E8C84A]" },
    "Secret Illustration Rare": { bg: "bg-[#FDF4DC]", text: "text-[#7A5000]", border: "border border-[#E8C84A]" },
    "Mega Hyper Rare": { bg: "bg-[#FDF0C0]", text: "text-[#7A5800]", border: "border border-[#D4A800]" },
    "Hyper rare": { bg: "bg-[#FFF3CC]", text: "text-[#8A6100]", border: "border border-[#E5B93F]" },
    "LEGEND": { bg: "bg-[#FFF0D6]", text: "text-[#9A4B00]", border: "border border-[#E5A14C]" },
    "Black White Rare": { bg: "bg-[#E7E7EA]", text: "text-[#25252B]", border: "border border-[#777783]" },
    "Radiant Rare": { bg: "bg-[#FFF0F4]", text: "text-[#A32959]", border: "border border-[#E8A3B8]" },
    "Secret Rare": { bg: "bg-[#FFF4D6]", text: "text-[#805900]", border: "border border-[#E2B84A]" },
    "Shiny rare": { bg: "bg-[#E9F8F7]", text: "text-[#176E6A]", border: "border border-[#8ACCC7]" },
    "Unknown": { bg: "bg-lavender", text: "text-heather" },
};

export function getRarityStyle(rarity?: string) {
    if (!rarity) return RARITY_STYLES["Unknown"];
    return RARITY_STYLES[rarity] ?? RARITY_STYLES["Unknown"];
}

const RARITY_ABBREVIATIONS: Record<string, string> = {
    "Double rare": "DR",
    "Holo Rare": "HR",
    "Rare Holo": "RH",
    "Rare Holo LV.X": "RH LV.X",
    "Holo Rare V": "HR V",
    "Holo Rare VMAX": "HR VMAX",
    "Rare PRIME": "R PRIME",
    "ACE SPEC Rare": "ACE SPEC",
    "Illustration rare": "IR",
    "Ultra Rare": "UR",
    "Mega Attack Rare": "Mega AR",
    "Holo Rare VSTAR": "HR VSTAR",
    "Special illustration rare": "SIR",
    "Secret Illustration Rare": "SIR",
    "Mega Hyper Rare": "Mega HR",
    "Hyper rare": "Hyper R",
    "Black White Rare": "BW Rare",
    "Radiant Rare": "Radiant R",
    "Secret Rare": "SR",
    "Shiny rare": "Shiny R",
};

export function getRarityAbbreviation(rarity?: string) {
    if (!rarity) return "";
    return RARITY_ABBREVIATIONS[rarity] ?? rarity;
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