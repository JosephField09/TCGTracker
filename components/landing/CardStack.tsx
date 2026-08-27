"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const CARDS = [
    {
        id: 1,
        image: "https://assets.tcgdex.net/en/base/base1/4",
        name: "Charizard",
        translateX: -80,
        translateY: 60,
        zIndex: 1,
    },
    {
        id: 2,
        image: "https://assets.tcgdex.net/en/base/base1/6",
        name: "Gyarados",
        translateX: 0,
        translateY: 0,
        zIndex: 2,
    },
    {
        id: 3,
        image: "https://assets.tcgdex.net/en/base/base3/4",
        name: "Dragonite",
        translateX: 80,
        translateY: 60,
        zIndex: 1,
    },
];

export default function CardStack() {
    const [hoveredId, setHoveredId] = useState<number | null>(null);

    return (
        <div className="relative w-72 h-96 flex items-center justify-center">
            {CARDS.map((card) => {
                const isHovered = hoveredId === card.id;
                const isOtherHovered = hoveredId !== null && !isHovered;

                return (
                    <motion.div
                        key={card.id}
                        className="absolute w-56 cursor-pointer"
                        style={{
                            zIndex: isHovered ? 10 : card.zIndex,
                        }}
                        initial={{
                            x: card.translateX,
                            y: card.translateY,
                            opacity: 1,
                        }}
                        animate={{
                            x: card.translateX,
                            y: isHovered ? -20 : card.translateY,
                            scale: isHovered ? 1.05 : 1,
                            opacity: isOtherHovered ? 0.3 : 1,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 25,
                        }}
                        onHoverStart={() => setHoveredId(card.id)}
                        onHoverEnd={() => setHoveredId(null)}
                    >
                        <div className="overflow-hidden shadow-xl">
                            <img
                                src={`${card.image}/high.png`}
                                alt={card.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
