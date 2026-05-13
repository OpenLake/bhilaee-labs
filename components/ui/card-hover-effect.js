'use client';

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const HoverEffect = ({
  items,
  renderItem,
  className,
}) => {
  let [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div
      className={cn(className)}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem',
        position: 'relative'
      }}
    >
      {items.map((item, idx) => (
        <div
          key={item?.id || idx}
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
          style={{ position: 'relative', height: '100%' }}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
                style={{
                    position: 'absolute',
                    inset: '-8px', // Expand slightly outside the card
                    height: 'calc(100% + 16px)',
                    width: 'calc(100% + 16px)',
                    background: 'var(--bg-secondary)',
                    borderRadius: '16px',
                    zIndex: 0,
                    border: '1px solid var(--border-color)'
                }}
              />
            )}
          </AnimatePresence>
          <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>
            {renderItem(item)}
          </div>
        </div>
      ))}
    </div>
  );
};
