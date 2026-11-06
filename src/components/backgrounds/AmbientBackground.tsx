'use client';

import { useEffect, useRef } from 'react';
import type { BackgroundProps } from './types';

/**
 * Background 01 · Ambient (청록 · 마젠타 안개 + 떠다니는 입자)
 *
 * - 순수 WebGL(라이브러리 없음) + Canvas 2D 입자로 구성
 * - 스크롤에 따라 안개가 미세하게 반응 (window.scrollY 기반)
 * - prefers-reduced-motion, 탭 비활성화, WebGL 컨텍스트 손실, WebGL 미지원
 *   폴백까지 모두 처리
 * - 페이지의 배경으로 쓰도록 position:absolute, inset:0 wrapper로 감쌈
 *   → 부모 요소에 position:relative(또는 fixed)를 지정해서 배치하세요.
 */
export default function AmbientBackground({
  speed = 2,
  className,
}: BackgroundProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mistRef = useRef<HTMLCanvasElement>(null);
  const dustRef = useRef<HTMLCanvasElement>(null);
  const fallbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mist = mistRef.current;
    const dust = dustRef.current;
    const fallback = fallbackRef.current;
    if (!mist || !dust) return;

    const ctx = dust.getContext('2d');
    if (!ctx) return;

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');

    let reduced = media.matches;
    let paused = document.hidden;
    let time = 12;
    let last = 0;
    let w = window.innerWidth;
    let h = window.innerHeight;
    let scroll = 0;
    let raf = 0;

    // ------------------------------------------------------------
    // WebGL 안개
    // ------------------------------------------------------------
    const gl = mist.getContext('webgl', {
      alpha: false,
      antialias: false,
      powerPreference: 'low-power',
    });

    let program: WebGLProgram | null = null;
    let uniforms: {
      resolution: WebGLUniformLocation | null;
      time: WebGLUniformLocation | null;
      scroll: WebGLUniformLocation | null;
    } | null = null;

    const vertexSource = `
      attribute vec2 a;
      void main() {
        gl_Position = vec4(a, 0., 1.);
      }
    `;

    const fragmentSource = `
      precision mediump float;
      uniform vec2 resolution;
      uniform float time;
      uniform float scroll;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }

      float noise(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        f = f * f * (3. - 2. * f);
        return mix(
          mix(hash(i), hash(i + vec2(1., 0.)), f.x),
          mix(hash(i + vec2(0., 1.)), hash(i + vec2(1.)), f.x),
          f.y
        );
      }

      float fbm(vec2 p) {
        float f = 0., a = .5;
        for (int i = 0; i < 5; i++) {
          f += a * noise(p);
          p = mat2(.8, -.6, .6, .8) * p * 2.03 + vec2(7.1, 3.2);
          a *= .5;
        }
        return f;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / resolution;
        vec2 p = uv * vec2(3.2, 2.3);
        p.y += scroll * .095;
        float t = time * .028;

        vec2 q = vec2(
          fbm(p + vec2(t, -t * .4)),
          fbm(p + vec2(4.7, -t * .65))
        );

        float cloud = fbm(p + q * 2.9 + vec2(0., -t * .35));
        float filaments = pow(max(0., 1. - abs(cloud - .49) * 9.), 4.);
        float detail = fbm(p * 3.3 + q * 3.);
        float body = smoothstep(.25, .77, cloud);

        float left = exp(-pow((uv.x + .04) / .24, 2.)) * (.44 + .56 * (1. - uv.y));
        left += .42 * exp(-pow((uv.y + .06) / .19, 2.) - pow((uv.x - .16) / .27, 2.));

        float right = exp(-pow((uv.x - 1.04) / .23, 2.)) * (.4 + .6 * uv.y);
        right += .3 * exp(-pow((uv.y - 1.06) / .19, 2.) - pow((uv.x - .89) / .2, 2.));

        float density = body * .5 + filaments * detail * .65;

        vec3 color = vec3(.11765, .12157, .1451)
          + vec3(.025, .31, .32) * left * density
          + vec3(.34, .075, .20) * right * density;

        color += (hash(gl_FragCoord.xy) - .5) * .006;
        gl_FragColor = vec4(color, 1.);
      }
    `;

    function compile(type: number, source: string): WebGLShader {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, source);
      gl!.compileShader(s);
      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
        const info = gl!.getShaderInfoLog(s);
        gl!.deleteShader(s);
        throw new Error(info || 'shader compile failed');
      }
      return s;
    }

    function showFallback() {
      mist!.hidden = true;
      if (fallback) fallback.hidden = false;
    }

    try {
      if (!gl) throw new Error('No WebGL');

      program = gl.createProgram()!;
      gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) || 'link failed');
      }
      gl.useProgram(program);

      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW
      );
      const aLoc = gl.getAttribLocation(program, 'a');
      gl.enableVertexAttribArray(aLoc);
      gl.vertexAttribPointer(aLoc, 2, gl.FLOAT, false, 0, 0);

      uniforms = {
        resolution: gl.getUniformLocation(program, 'resolution'),
        time: gl.getUniformLocation(program, 'time'),
        scroll: gl.getUniformLocation(program, 'scroll'),
      };
    } catch {
      program = null;
      showFallback();
    }

    // ------------------------------------------------------------
    // Canvas 2D 입자
    // ------------------------------------------------------------
    let seed = 71;
    function random() {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    }

    const particles = Array.from({ length: 115 }, () => ({
      side: random() > 0.48 ? 1 : 0,
      x: Math.pow(random(), 2) * 0.22,
      y: random(),
      r: random(),
      phase: random() * 6.28,
      depth: 0.3 + random() * 0.7,
      driftFreq: 0.02 + random() * 0.13,
      driftAmp: 10 + random() * 30,
      wanderFreq: 0.01 + random() * 0.045,
      wanderAmp: 20 + random() * 48,
      riseVar: 0.35 + random() * 1.7,
      wobblePhase: random() * 6.28,
      wobblePhase2: random() * 6.28,
    }));

    // 입자 이미지 캐시: 매 프레임 입자마다 createRadialGradient를 만들면 무거우므로
    // 색상별로 한 번만 그려두고 drawImage + globalAlpha로 재사용
    const SPRITE_SIZE = 64;
    function makeSprite(rgb: string) {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = SPRITE_SIZE;
      const spriteCtx = canvas.getContext('2d')!;
      const half = SPRITE_SIZE / 2;
      const g = spriteCtx.createRadialGradient(half, half, 0, half, half, half);
      g.addColorStop(0, `rgba(${rgb},1)`);
      g.addColorStop(0.25, `rgba(${rgb},0.5)`);
      g.addColorStop(1, `rgba(${rgb},0)`);
      spriteCtx.fillStyle = g;
      spriteCtx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);
      return canvas;
    }
    const sprites = {
      pink: makeSprite('191,112,153'),
      teal: makeSprite('83,187,188'),
    };

    // ------------------------------------------------------------
    // 리사이즈 / 렌더
    // ------------------------------------------------------------
    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      // 흐릿한 빛 입자라 고해상도가 필요 없음 → 1배로 고정해 픽셀 수(최대 2.25배)를 줄임
      const dpr = 1;

      dust!.width = Math.round(w * dpr);
      dust!.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const ratio = Math.min(1, 1100 / w);
      mist!.width = Math.round(w * ratio);
      mist!.height = Math.round(h * ratio);
      if (program && gl) gl.viewport(0, 0, mist!.width, mist!.height);

      draw();
    }

    function draw() {
      if (program && gl && uniforms) {
        gl.uniform2f(uniforms.resolution, mist!.width, mist!.height);
        gl.uniform1f(uniforms.time, time);
        gl.uniform1f(uniforms.scroll, scroll);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }

      ctx!.clearRect(0, 0, w, h);

      for (const p of particles) {
        const x =
          (p.side ? 1 - p.x : p.x) * w +
          Math.sin(time * p.driftFreq + p.phase) * p.driftAmp * p.depth +
          Math.sin(time * p.wanderFreq + p.wobblePhase2) * p.wanderAmp * p.depth +
          Math.cos(time * 0.05 + p.wobblePhase) * 5 * p.depth;

        const y =
          (((p.y * h - time * 1.6 * p.depth * p.riseVar - scroll * 65 * p.depth) % (h + 30) + h + 30) % (h + 30)) -
          15 +
          Math.sin(time * 0.22 + p.wobblePhase) * 10 * p.depth +
          Math.cos(time * p.wanderFreq * 1.3 + p.wobblePhase2) * 14 * p.depth;

        const r = p.r > 0.94 ? 4 + p.r * 3 : 0.4 + p.r * 1.2;
        const alpha = (0.12 + 0.2 * p.r) * (0.8 + 0.2 * Math.sin(time * 0.2 + p.phase));
        const radius = r * 3;

        // 기존 radialGradient(alpha → alpha*0.5 → 0)와 같은 모양을 캐시 이미지로 그림
        ctx!.globalAlpha = alpha;
        ctx!.drawImage(p.side ? sprites.pink : sprites.teal, x - radius, y - radius, radius * 2, radius * 2);
      }
      ctx!.globalAlpha = 1;
    }

    function loop(now: number) {
      raf = 0;
      if (document.hidden || paused) return;

      const delta = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!reduced) time += delta * speed;

      const target = reduced ? 0 : Math.min(window.scrollY / Math.max(h * 0.55, 1), 1);
      scroll += (target - scroll) * 0.045;

      draw();
      raf = requestAnimationFrame(loop);
    }

    function start() {
      cancelAnimationFrame(raf);
      last = performance.now();
      if (!paused && !document.hidden) raf = requestAnimationFrame(loop);
    }

    function onVisibility() {
      paused = document.hidden;
      start();
    }

    function onMediaChange() {
      reduced = media.matches;
    }

    function onContextLost(e: Event) {
      e.preventDefault();
      program = null;
      showFallback();
    }

    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);
    media.addEventListener('change', onMediaChange);
    mist.addEventListener('webglcontextlost', onContextLost);

    resize();
    start();

    // React 클린업: 언마운트 시 모든 리스너/루프/리소스 정리
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      media.removeEventListener('change', onMediaChange);
      mist.removeEventListener('webglcontextlost', onContextLost);
      if (gl && program) {
        gl.deleteProgram(program);
      }
    };
  }, [speed]);

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        width: '100vw',
        height: '100vh',
        background:
          'radial-gradient(ellipse at 0% 90%, #17464a66, transparent 45%), ' +
          'radial-gradient(ellipse at 100% 15%, #60324955, transparent 40%), ' +
          '#1e1f25',
      }}
    >
      <canvas
        ref={mistRef}
        aria-hidden="true"
        width={1100}
        height={660}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      />
      <canvas
        ref={dustRef}
        aria-hidden="true"
        width={2486}
        height={1491}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      />
      {/* WebGL을 사용할 수 없을 때만 보이는 CSS 그라디언트 폴백 */}
      <div
        ref={fallbackRef}
        hidden
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 9% 62%, rgba(49,199,215,0.28), transparent 42%), ' +
            'radial-gradient(ellipse at 91% 40%, rgba(255,79,139,0.28), transparent 42%), ' +
            '#1e1f25',
        }}
      />
    </div>
  );
}
