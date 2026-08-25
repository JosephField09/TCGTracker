import { FaDragon } from "react-icons/fa";
import { FaFire } from "react-icons/fa";
import { IoIosWater } from "react-icons/io";
import { FaLeaf } from "react-icons/fa";
import { BsFillLightningFill } from "react-icons/bs";
import { FaEye } from "react-icons/fa";
import { FaHandFist } from "react-icons/fa6";
import { AiFillMoon } from "react-icons/ai";
import { MdCenterFocusStrong } from "react-icons/md";
import { GiHeartWings } from "react-icons/gi";
import { FaStar } from "react-icons/fa6";

interface Props {
    type: string;
    size?: number;
    className?: string;
}

const TYPE_ICONS: Record<string, (size: number) => React.ReactNode> = {
    Fire: () => <FaFire />,
    Water: () => <IoIosWater />,
    Grass: () => <FaLeaf />,
    Lightning: () => <BsFillLightningFill />,
    Psychic: () => <FaEye />,
    Fighting: () => <FaHandFist />,
    Darkness: () => <AiFillMoon />,
    Metal: () => <MdCenterFocusStrong />,
    Dragon: () => <FaDragon />,
    Fairy: () => <GiHeartWings />,
    Colorless: (s) => <FaStar />,
};

export default function TypeIcon({ type, size = 20, className = "" }: Props) {
    const render = TYPE_ICONS[type];
    if (!render) return null;
    return (
        <span
            className={`inline-flex items-center justify-center shrink-0 ${className}`}
        >
            {render(size)}
        </span>
    );
}
