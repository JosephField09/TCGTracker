interface Props {
  rarity: string;
  size?: number;
  className?: string;
}

const RARITY_SVGS: Record<string, (size: number) => React.ReactNode> = {
    Common: (s) => (
        <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="7" stroke="#4A4270" strokeWidth="2" fill="none"/>
        </svg>
    ),
    Uncommon: (s) => (
        <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
            <path d="M10 3l7 7-7 7-7-7z" stroke="#1F5280" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
        </svg>
    ),
    Rare: (s) => (
        <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
            <path d="M10 2l2 6h6l-5 3.5 2 6L10 14l-5 3.5 2-6L2 8h6z" fill="#2A2A2A"/>
        </svg>
    ),
    "Double rare": (s) => (
        <svg width={s} height={s} viewBox="0 0 24 20" fill="none">
            <path d="M7 2l1.5 4.5H13l-3.5 2.5 1.5 4.5L7 11l-4.5 2.5 1.5-4.5L.5 6.5H5z" fill="#2A2A2A"/>
            <path d="M17 2l1.5 4.5H23l-3.5 2.5 1.5 4.5L17 11l-4.5 2.5 1.5-4.5L10.5 6.5H15z" fill="#2A2A2A"/>
        </svg>
    ),
    "Illustration rare": (s) => (
        <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
            <path d="M10 2l2 6h6l-5 3.5 2 6L10 14l-5 3.5 2-6L2 8h6z" fill="#1E6030"/>
        </svg>
    ),
    "Ultra Rare": (s) => (
        <svg width={s} height={s} viewBox="0 0 24 20" fill="none">
            <path d="M7 2l1.5 4.5H13l-3.5 2.5 1.5 4.5L7 11l-4.5 2.5 1.5-4.5L.5 6.5H5z" fill="#1A4A8A"/>
            <path d="M17 2l1.5 4.5H23l-3.5 2.5 1.5 4.5L17 11l-4.5 2.5 1.5-4.5L10.5 6.5H5z" fill="#1A4A8A"/>
        </svg>
    ),
    "Mega Attack Rare": (s) => (
        <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
            <path d="M10 2l2 6h6l-5 3.5 2 6L10 14l-5 3.5 2-6L2 8h6z" fill="#8A2060"/>
            <path d="M10 2l2 6h6l-5 3.5 2 6L10 14l-5 3.5 2-6L2 8h6z" fill="#2A8A40" opacity="0.5"/>
        </svg>
    ),
    "Special illustration rare": (s) => (
        <svg width={s} height={s} viewBox="0 0 24 20" fill="none">
            <path d="M7 2l1.5 4.5H13l-3.5 2.5 1.5 4.5L7 11l-4.5 2.5 1.5-4.5L.5 6.5H5z" fill="#E8A030"/>
            <path d="M17 2l1.5 4.5H23l-3.5 2.5 1.5 4.5L17 11l-4.5 2.5 1.5-4.5L10.5 6.5H15z" fill="#E8A030"/>
        </svg>
    ),
    "Mega Hyper Rare": (s) => (
        <svg width={s} height={s} viewBox="0 0 20 20" fill="none">
            <path d="M10 2l8 8-8 8-8-8z" fill="#D4A800" stroke="#E8C84A" strokeWidth="1"/>
        </svg>
    ),
};

export default function RarityIcon({ rarity, size = 16, className = "" }: Props) {
    const render = RARITY_SVGS[rarity];
    if (!render) return null;
    return (
        <span className={`inline-flex items-center justify-center flex-shrink-0 ${className}`}>
            {render(size)}
        </span>
    );
}