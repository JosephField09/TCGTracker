interface Props {
  type: string;
  size?: number;
  className?: string;
}

const TYPE_SVGS: Record<string, (size: number) => React.ReactNode> = {
    Fire: (s) => (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="16" fill="#FEF0CC"/>
            <path d="M16 6c0 0-1.5 3-1.5 5.5 0 1.2.8 2 1.5 2 .7 0 1.5-.8 1.5-2C17.5 9 16 6 16 6z" fill="#B84000"/>
            <path d="M10 18c0-3 2-5 4-7 0 3 2 4 2 6.5 0 2.5-2 4.5-4 4.5C10 22 10 20.5 10 18z" fill="#E05020"/>
            <path d="M16 13c1.5 2 3 3.5 3 5.5 0 2.8-2.2 5-5 5s-5-2.2-5-5c0-1.5.6-2.8 1.5-3.8C11 17 12 18 14 18c0-2.5-1-3.5-1-5 1 1 3 0 3-5z" fill="#B84000"/>
        </svg>
    ),
    Water: (s) => (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="16" fill="#DFF0FF"/>
            <path d="M16 7l6 9a6 6 0 11-12 0l6-9z" fill="#0D5A9E"/>
        </svg>
    ),
    Grass: (s) => (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="16" fill="#E4F5E0"/>
            <path d="M16 24V12M16 12C16 12 10 8 8 10c2 0 5 3 8 8M16 12c0 0 6-4 8-2-2 0-5 3-8 8" stroke="#1E6B2E" strokeWidth="2" strokeLinecap="round"/>
            <path d="M16 16c0 0-4-2-5-6 1.5 1 4 3 5 6zM16 16c0 0 4-2 5-6-1.5 1-4 3-5 6z" fill="#1E6B2E"/>
        </svg>
    ),
    Lightning: (s) => (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="16" fill="#FEF5CC"/>
            <path d="M18 7l-6 10h5l-3 8 8-11h-5l1-7z" fill="#8A6400"/>
        </svg>
    ),
    Psychic: (s) => (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="16" fill="#F5E8F8"/>
            <circle cx="16" cy="16" r="6" stroke="#7A1E8A" strokeWidth="2" fill="none"/>
            <circle cx="16" cy="16" r="2.5" fill="#7A1E8A"/>
            <path d="M16 7v3M16 22v3M7 16h3M22 16h3" stroke="#7A1E8A" strokeWidth="2" strokeLinecap="round"/>
        </svg>
    ),
    Fighting: (s) => (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="16" fill="#F5EBE0"/>
            <path d="M11 12l4 4-4 4M21 12l-4 4 4 4" stroke="#8A3A10" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    ),
    Darkness: (s) => (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="16" fill="#EAF0E8"/>
            <path d="M20 10a8 8 0 11-8 10A6 6 0 0020 10z" fill="#1E2E20"/>
        </svg>
    ),
    Metal: (s) => (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="16" fill="#EEF0F5"/>
            <circle cx="16" cy="16" r="7" stroke="#3A4A5A" strokeWidth="2" fill="none"/>
            <circle cx="16" cy="16" r="3" fill="#3A4A5A"/>
        </svg>
    ),
    Dragon: (s) => (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="16" fill="#FCE8F3"/>
            <path d="M8 20l4-8 4 4 4-8 4 4" stroke="#6A1060" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    ),
    Fairy: (s) => (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="16" fill="#FFF0E8"/>
            <path d="M16 8l1.5 5h5l-4 3 1.5 5-4-3-4 3 1.5-5-4-3h5z" fill="#A03060"/>
        </svg>
    ),
    Colorless: (s) => (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="16" fill="#F0F0F0"/>
            <path d="M16 8l1.5 5h5l-4 3 1.5 5-4-3-4 3 1.5-5-4-3h5z" fill="#4A4A4A"/>
        </svg>
    ),
};

export default function TypeIcon({ type, size = 20, className = "" }: Props) {
    const render = TYPE_SVGS[type];
    if (!render) return null;
    return (
        <span className={`inline-flex items-center justify-center flex-shrink-0 ${className}`}>
            {render(size)}
        </span>
    );
}