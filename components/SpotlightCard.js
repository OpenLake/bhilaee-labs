'use client';

import { useRef } from 'react';
import './SpotlightCard.css';

const SpotlightCard = ({ children, className = '', spotlightColor = 'rgba(var(--secondary-color-rgb), 0.15)', as: Component = 'div', ...props }) => {
  const divRef = useRef(null);

  const handleMouseMove = e => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    divRef.current.style.setProperty('--mouse-x', `${x}px`);
    divRef.current.style.setProperty('--mouse-y', `${y}px`);
    divRef.current.style.setProperty('--spotlight-color', spotlightColor);
  };

  return (
    <Component 
        ref={divRef} 
        onMouseMove={handleMouseMove} 
        className={`card-spotlight ${className}`}
        {...props}
    >
      {children}
    </Component>
  );
};

export default SpotlightCard;
