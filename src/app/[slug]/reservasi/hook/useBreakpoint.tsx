"use client";

import { useState, useEffect } from "react";

type Breakpoint = 'sm' | 'md' | 'lg';

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
};

export function useBreakpoint(): Breakpoint {
    const [breakpoint, setBreakpoint] = useState<Breakpoint>('lg');

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < breakpoints.sm) {
                setBreakpoint('sm');
            } else if (width < breakpoints.md) {
                setBreakpoint('md');
            } else {
                setBreakpoint('lg');
            }
        };

        handleResize(); // Set initial breakpoint
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return breakpoint;
}