"use client";

interface Props {
    variants: string[];
    ownedVariants: Record<string, number>;
    size?: number;
}

export default function VariantIcon({ variants, ownedVariants, size= 20}: Props) {
    const hasMultiple = variants.length > 1;
    const ownsNormal = (ownedVariants["normal"] ?? 0) > 0;
    const ownsAnySpecial = variants.filter((v) => v !== "normal").some((v) => (ownedVariants[v] ?? 0) > 0);
    const ownsAll = variants.every((v) => (ownedVariants[v] ?? 0) > 0);

    if (!hasMultiple) {
        return (
            <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
                <rect
                    x="2" y="2" width="16" height="16" rx="2"
                    fill={"#8B6FD4"}
                    opacity={ownsAnySpecial || ownsNormal ? 1 : 0.25}
                />
                {ownsAll ? (
                    <path
                        d="M10 6l1.2 2.6 2.8.4-2 2 .5 2.8L10 12.5l-2.5 1.3.5-2.8-2-2 2.8-.4z"
                        fill="white"
                    />
                ) : (
                    <circle
                        cx="10" cy="10" r="3.5"
                        stroke="white"
                        strokeWidth="1.5"
                        fill="none"
                    />
                )}
            </svg>
        );
    }

    return (
        <svg width={size + 4} height={size} viewBox="0 0 24 20" fill="none">
            <rect
                x="6" y="2" width="16" height="16" rx="2"
                fill="#7B6FA0"
                opacity={ownsAnySpecial ? 1 : 0.25}
            />
            <rect
                x="2" y="4" width="16" height="16" rx="2"
                fill="#8B6FD4"
                opacity={ownsNormal ? 1 : 0.25}
            />
            {ownsAll ? (
                <path
                    d="M10 9l1 2.2 2.4.3-1.7 1.7.4 2.4L10 14.4l-2.1 1.2.4-2.4-1.7-1.7 2.4-.3z"
                    fill="white"
                />
            ) : (
                <circle
                    cx="10" cy="12" r="3"
                    stroke="white"
                    strokeWidth="1.5"
                    fill="none"
                />
            )}
        </svg>
    );
}