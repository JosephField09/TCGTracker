import type { IconType } from "react-icons";
import { FaRegCircle } from "react-icons/fa";
import { GoDiamond } from "react-icons/go";
import {
    PiStarDuotone,
    PiStarBold,
    PiStarFill,
    PiStarFourFill,
    PiStarFourDuotone,
    PiStarHalfFill,
} from "react-icons/pi";
import { TbStars, TbStarsFilled } from "react-icons/tb";
import { BsStars } from "react-icons/bs";

interface Props {
    rarity: string;
    size?: number;
    className?: string;
}

const RARITY_ICONS: Record<string, IconType> = {
    Common: FaRegCircle,
    Uncommon: GoDiamond,
    Rare: PiStarBold,

    "Double rare": PiStarDuotone,
    "Holo Rare": PiStarDuotone,
    "Rare Holo": PiStarDuotone,

    "Illustration rare": PiStarFill,
    "Rare Holo LV.X": PiStarFill,
    "Holo Rare V": PiStarFill,

    "Ultra Rare": PiStarFourFill,

    "Mega Attack Rare": PiStarFourDuotone,
    "Holo Rare VMAX": PiStarFourDuotone,
    "Rare PRIME": PiStarFourDuotone,
    "ACE SPEC Rare": PiStarFourDuotone,

    "Special illustration rare": TbStars,
    "Holo Rare VSTAR": TbStars,
    LEGEND: TbStars,

    "Hyper rare": TbStarsFilled,
    "Mega Hyper Rare": TbStarsFilled,
    "Black White Rare": TbStarsFilled,
    "Radiant Rare": TbStarsFilled,

    "Secret Rare": PiStarHalfFill,
    "Shiny rare": BsStars,
};

export default function RarityIcon({
    rarity,
    size = 16,
    className = "",
}: Props) {
    const Icon = RARITY_ICONS[rarity];

    if (!Icon) return null;

    return (
        <span
            className={`inline-flex items-center justify-center shrink-0 ${className}`}
        >
            <Icon size={size} />
        </span>
    );
}
