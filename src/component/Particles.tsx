'use client'

import React from "react";
import Particles from "react-tsparticles";
import { useCallback } from "react";
import type { Container, ISourceOptions, Engine } from "tsparticles-engine";
import { loadFull } from "tsparticles";

const particleOption : ISourceOptions = {
    background: {
        color: {
            value: "#1E1F25",
        },
    },
    fpsLimit: 120,
    interactivity: {
        events: {
            resize: true,
        },
        modes: {
            push: {
                quantity: 4,
            },
            repulse: {
                distance: 200,
                duration: 0.4,
            },
        },
    },
    responsive: [{
        maxWidth : 768,
        options:{
            particles : {
                links: {
                    opacity: 0,
                },
            }
        }
    }],
    particles: {
        color: {
            value: ["#03dac6", "#ff0266", "#000000"],
        },
        links: {
            color: "random",
            distance: 150,
            enable: true,
            opacity: 0.5,
            width: 1,
        },
        collisions: {
            enable: true,
        },
        move: {
            enable: true,
            random: true,
            speed: 2,
            straight: false,
        },
        number: {
            density: {
                enable: true,
                area: 800,
            },
            value: 80,
        },
        opacity: {
            value: 0.5,
        },
        shape: {
            type: "circle",
        },
        size: {
            value: { min: 1, max: 5 },
        },
    },
    detectRetina: true,
}

export default function ParticlesUI() {
    const particlesInit = useCallback(async (engine: Engine) => {
        console.log(engine);
        // you can initialize the tsParticles instance (engine) here, adding custom shapes or presets
        // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
        // starting from v2 you can add only the features you need reducing the bundle size
        await loadFull(engine);
    }, []);


    const particlesLoaded = useCallback(async (container: Container | undefined) => {
        await console.log(container);
    }, []);

    return (
         <Particles
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={particleOption}
        />
    );

}