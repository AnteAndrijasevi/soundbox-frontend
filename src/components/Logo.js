import React, { useEffect, useRef } from 'react';

function Logo({ size = 40, withTail = false }) {
    const pathRef = useRef(null);

    useEffect(() => {
        const path = pathRef.current;
        if (!path) return;
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
        setTimeout(() => {
            path.style.transition = 'stroke-dashoffset 3.5s ease forwards';
            path.style.strokeDashoffset = '0';
        }, 100);
    }, []);

    return (
        <svg
            width={withTail ? size * 2 : size}
            height={size}
            viewBox={withTail ? "-100 0 200 100" : "0 0 100 100"}
            fill="none"
        >
            {/* Tail from text */}
            {withTail && (
                <path
                    d="M -95 75 Q -70 78 -45 72 Q -20 65 -5 50 Q 5 38 10 28 Q 14 22 18 20"
                    stroke="#111"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    fill="none"
                />
            )}


            {/* Square frame */}
            <rect x="4" y="4" width="92" height="92" rx="6"
                  stroke="#111" strokeWidth="1.5" fill="none" />

            {/* Tonearm */}
            <line x1="86" y1="14" x2="68" y2="36"
                  stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="86" cy="14" r="2" fill="#111" />
            <circle cx="68" cy="36" r="1.5" fill="#111" />

            {/* Animated sketch spiral */}
            <path
                ref={pathRef}
                d="
          M 18 20
          Q 8 28 10 40
          Q 12 50 8 56
          Q 6 64 12 72
          Q 18 80 28 82
          Q 38 86 48 84
          Q 62 82 72 74
          Q 82 64 82 52
          Q 82 38 74 28
          Q 64 16 50 14
          Q 36 12 26 20
          Q 16 28 15 40
          Q 14 52 20 62
          Q 26 72 36 76
          Q 46 80 56 76
          Q 66 72 70 62
          Q 74 52 70 42
          Q 66 32 56 28
          Q 46 24 37 28
          Q 28 32 26 42
          Q 24 52 28 60
          Q 32 68 40 70
          Q 48 72 56 68
          Q 62 64 64 56
          Q 66 48 62 42
          Q 58 36 52 34
          Q 46 32 40 36
          Q 34 40 34 48
          Q 34 56 38 62
          Q 42 66 48 66
          Q 54 66 58 62
          Q 62 58 62 52
          Q 62 46 58 42
          Q 54 38 48 38
          Q 42 38 39 42
          Q 36 46 37 52
          Q 38 58 42 60
          Q 46 62 50 60
          Q 54 58 55 54
          Q 56 50 54 47
          Q 52 44 48 44
          Q 44 44 43 47
          Q 42 50 43 53
          Q 44 55 47 56
          Q 50 57 52 55
          Q 54 53 53 51
          Q 52 49 50 49
          Q 48 49 48 51
          Q 48 52 50 52
        "
                stroke="#111"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />

            {/* Center hole */}
            <circle cx="50" cy="51" r="2.5"
                    stroke="#111" strokeWidth="1.2" fill="white" />

        </svg>
    );
}

export default Logo;