'use client'

import React from "react";
import Particles from "react-tsparticles";
import { useCallback } from "react";
import type { ISourceOptions, Engine } from "tsparticles-engine";
import { loadFull } from "tsparticles";

const particleOption : ISourceOptions = {
    background: {
        color: {
            value: "#1E1F25",
        },
    },
    fullScreen : false,
    fpsLimit: 60,
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
        // 충돌 계산은 파티클 수의 제곱만큼 연산이 늘어 무거움 (눈에 띄는 차이는 적음)
        collisions: {
            enable: false,
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
    // 레티나에서 캔버스 픽셀이 4배가 되어 스크롤 중 프레임 저하 → 끔
    detectRetina: false,
}

export default function ParticlesUI() {
    const particlesInit = useCallback(async (engine: Engine) => {
        await loadFull(engine);
    }, []);

    return (
         <Particles
            id="tsparticles"
            init={particlesInit}
            options={particleOption}
        />
    );

}