import { getTypeStyle } from "@/lib/badges";
import TypeIcon from "@/components/icons/TypeIcon";

interface Props {
    type: string;
    showIcon?: boolean;
    className?: string;
}

export default function TypeBadge({ type, showIcon = true, className = "" }: Props) {
    const { bg, text } = getTypeStyle(type);

    return (
        <span className={`inline-flex items-center gap-1 text-sm px-3 py-1 rounded-full font-medium ${bg} ${text} ${className}`}>
            {showIcon && <TypeIcon type={type} size={25} />}
            {type}
        </span>
    )
}