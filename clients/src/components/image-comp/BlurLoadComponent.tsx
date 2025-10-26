'use client'
import React, { createContext, useEffect, useRef } from 'react';

type BlurDiv = {
    div: HTMLElement;
    img: HTMLImageElement;
};

type BlurLoadContextType = ((div: HTMLElement, img: HTMLImageElement) => void) | undefined;

const BlurLoadContext = createContext<BlurLoadContextType>(undefined);

interface BlurLoadProps {
    children: React.ReactNode;
}


const BlurLoadProvider = ({ children }: BlurLoadProps) => {
    const blurDivsRef = useRef<BlurDiv[]>([]);

    useEffect(() => {
        blurDivsRef.current.forEach(({ div, img }) => {
            function loaded() {
                div.classList.add('loaded');
            }

            if (img.complete) {
                loaded();
            } else {
                img.addEventListener('load', loaded);
            }

            return () => {
                img.removeEventListener('load', loaded);
            };
        });
    }, []);

    const registerBlurDiv = (div: HTMLElement, img: HTMLImageElement) => {
        blurDivsRef.current.push({ div, img });
    };

    return (
        <BlurLoadContext.Provider value={registerBlurDiv}>
            {children}
        </BlurLoadContext.Provider>
    );
};

export { BlurLoadProvider, BlurLoadContext };

