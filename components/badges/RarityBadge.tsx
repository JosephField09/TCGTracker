import { getRarityStyle } from "@/lib/badges";
import RarityIcon from "../icons/RarityIcon";

interface Props {
    rarity?: string;
    showIcon?: boolean;
    className?: string;
}

export default function RarityBadge({ rarity, showIcon = true, className = "" }: Props) {
    if (!rarity) return null;
    const { bg, text, border } = getRarityStyle(rarity);

    return (
        <span className={`inline-flex items-center gap-0.5 text-sm px-3 py-1 text-transform: capitalize rounded-full font-medium ${bg} ${text} ${border ?? ""} ${className}`}>
            {showIcon && <RarityIcon rarity={rarity} size={14} />}
            {rarity}
        </span>
    )
}