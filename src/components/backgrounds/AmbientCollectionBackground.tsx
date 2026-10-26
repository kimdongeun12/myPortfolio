'use client';

import { useEffect, useRef } from 'react';
import clsx from 'clsx';

import type { BackgroundProps } from './types';

/**
 * Ambient 컬렉션 배경 (네 가지 WebGL 배경 + 포인터 인터랙션)
 *
 * - project     : 양옆의 빛 줄기가 서로 다른 속도로 흐름, 커서 높이에서 줄기가 살짝 휨
 * - blog-list   : 청록·핑크 색면이 천천히 번짐, 커서 쪽으로 색면이 끌려옴
 * - blog-detail : 가장자리 빛만 미세하게 변화, 커서 주변이 은은하게 밝아짐 (글 읽기용)
 * - guestbook   : 아래에서 파동이 퍼지고, 커서가 지나간 자리에 빛 흔적이 남음
 *
 * - 순수 WebGL 1 (라이브러리·이미지 없음), 화면에 고정(position: fixed)
 * - 움직임 줄이기 설정이면 정지 화면, 탭이 안 보이면 렌더링 중단
 * - WebGL을 쓸 수 없거나 컨텍스트를 잃으면 정적인 그라데이션으로 대체
 */
export type AmbientVariant = 'project' | 'blog-list' | 'blog-detail' | 'guestbook';

type AmbientCollectionBackgroundProps = BackgroundProps & {
  variant: AmbientVariant;
};

const VARIANT_INDEX: Record<AmbientVariant, number> = {
  project: 0,
  'blog-list': 1,
  'blog-detail': 2,
  guestbook: 3,
};

const BASE_SPEED = 0.5; // 원본 기본 속도 (speed prop은 여기에 곱해짐)
const TRAIL_N = 14;     // 방명록 빛 흔적 개수

const VERTEX = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';

const FRAGMENT = `precision highp float;
uniform vec2 resolution;uniform float time;uniform float mode;uniform vec2 mouse;uniform float mouseActive;uniform vec2 trailPos[14];uniform float trailAge[14];
float gauss(float x,float s){return exp(-x*x/(s*s));}
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
vec3 teal=vec3(.10,.55,.59);vec3 pink=vec3(.63,.19,.39);
void main(){vec2 uv=gl_FragCoord.xy/resolution;float t=time;vec3 c=vec3(.11765,.12157,.14510);
if(mode<.5){
 for(int side=0;side<2;side++){float x=side==0?uv.x:1.-uv.x;vec3 tint=side==0?teal:pink;float st=t*(side==0?1.:-.83);
 for(int i=0;i<5;i++){float k=float(i);float bend=.043+.019*k+(.024+.006*k)*sin(uv.y*4.4+k*.82+st*.13)+.12*pow(1.-uv.y,3.);float mx=side==0?mouse.x:1.-mouse.x;bend+=.05*mouseActive*gauss(uv.y-mouse.y,.16)*gauss(mx,.4);float d=abs(x-bend);float core=gauss(d,.00065+1./resolution.x*.4);float halo=gauss(d,.007);float ribbon=gauss(x-bend-.009,.014);float shimmer=.65+.35*sin(uv.y*5.-st*.23+k);c+=tint*(core*.30+halo*.058+ribbon*.036)*shimmer;}
 c+=tint*.03*gauss(x,.15);
 }
}else if(mode<1.5){
 vec2 a=uv-mix(vec2(-.04+.025*sin(t*.08),1.01+.035*cos(t*.06)),mouse,mouseActive*.35);vec2 b=uv-mix(vec2(1.04+.035*cos(t*.07),.06+.045*sin(t*.09)),mouse,mouseActive*.25);
 c+=teal*exp(-dot(a*vec2(1.3,1.),a*vec2(1.3,1.))*4.8)*(.19+.018*sin(t*.09));
 c+=pink*exp(-dot(b*vec2(1.2,1.),b*vec2(1.2,1.))*5.2)*(.22+.018*cos(t*.08));
}else if(mode<2.5){
 c+=teal*.035*gauss(uv.x+.05,.19)*(.7+.3*uv.y)*(.95+.05*sin(t*.045));
 c+=pink*.039*gauss(uv.x-1.05,.19)*(.9-.4*uv.y)*(.95+.05*cos(t*.04));
 c+=mix(teal,pink,smoothstep(0.,1.,uv.x))*mouseActive*.05*gauss(length(uv-mouse),.15);
}else{
 float r=length(vec2((uv.x-.5)*.8,(uv.y+.23)*1.85));float fade=1.-smoothstep(.18,.39,uv.y);vec3 tint=mix(teal,pink,smoothstep(.05,.95,uv.x));
 for(int i=0;i<4;i++){float k=float(i);float cyc=fract(t*.09-k*.25);float radius=mix(.34,1.05,cyc);float env=smoothstep(0.,.12,cyc)*(1.-smoothstep(.75,1.,cyc));float d=r-radius;c+=tint*(gauss(d,.007)*.11+gauss(d,.03)*.04)*fade*env;}
 c+=tint*gauss(uv.y,.14)*.07;
 for(int i=0;i<14;i++){float age=trailAge[i];vec3 ttint=mix(teal,pink,smoothstep(.05,.95,trailPos[i].x));float glow=gauss(length(uv-trailPos[i]),.04)*exp(-age*2.);c+=ttint*glow*.22;}
}
c+=(hash(gl_FragCoord.xy)-.5)*.002;gl_FragColor=vec4(c,1.);}`;

// WebGL을 못 쓸 때 보여줄 정적 배경
const FALLBACK_BG =
  'radial-gradient(ellipse at 0 50%, #21434a88, transparent 40%), radial-gradient(ellipse at 100% 80%, #56304488, transparent 40%), #1e1f25';

export default function AmbientCollectionBackground({
  variant,
  speed = 1,
  className,
}: AmbientCollectionBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mode = VARIANT_INDEX[variant];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let paused = reduce.matches;
    let time = 0;
    let last = 0;
    let raf = 0;
    let lost = false;
    let gl: WebGLRenderingContext | null = null;
    let program: WebGLProgram | null = null;
    let uniforms: Record<string, WebGLUniformLocation | null> = {};

    // 포인터 위치(0~1)와 반응 강도: 목표값으로 부드럽게 따라가고, 2.2초 멈추면 서서히 사라짐
    let mouseX = 0.5, mouseY = 0.5, mouseTX = 0.5, mouseTY = 0.5;
    let mouseActive = 0, mouseActiveTarget = 0;
    let idleTimer: ReturnType<typeof setTimeout> | undefined;

    // 방명록 전용 빛 흔적
    const trail: { x: number; y: number; age: number }[] = [];
    const trailPosArr = new Float32Array(TRAIL_N * 2);
    const trailAgeArr = new Float32Array(TRAIL_N).fill(99);
    let lastPushMs = 0;
    let lastPushX: number | null = null;
    let lastPushY: number | null = null;

    const pushTrail = (x: number, y: number, force = false) => {
      const now = performance.now();
      if (!force) {
        if (now - lastPushMs < 90) return;
        if (lastPushX !== null && lastPushY !== null) {
          const dx = x - lastPushX;
          const dy = y - lastPushY;
          if (dx * dx + dy * dy < 9e-4) return;
        }
      }
      lastPushMs = now;
      lastPushX = x;
      lastPushY = y;
      trail.unshift({ x, y, age: 0 });
      if (trail.length > TRAIL_N) trail.pop();
    };

    const showFallback = (show: boolean) => {
      canvas.style.visibility = show ? 'hidden' : 'visible';
    };

    function draw() {
      if (!gl || !program || lost) return;
      for (let i = 0; i < TRAIL_N; i++) {
        const p = trail[i];
        trailPosArr[i * 2] = p ? p.x : 0;
        trailPosArr[i * 2 + 1] = p ? p.y : 0;
        trailAgeArr[i] = p ? p.age : 99;
      }
      gl.uniform2fv(uniforms.trailPos, trailPosArr);
      gl.uniform1fv(uniforms.trailAge, trailAgeArr);
      gl.uniform2f(uniforms.resolution, canvas!.width, canvas!.height);
      gl.uniform1f(uniforms.time, time);
      gl.uniform1f(uniforms.mode, mode);
      gl.uniform2f(uniforms.mouse, mouseX, mouseY);
      gl.uniform1f(uniforms.mouseActive, mouseActive);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    function resize() {
      // 부드러운 빛이라 고해상도가 필요 없음: 레티나에서도 최대 1.25배, 큰 화면은 가로 1800px 기준으로 낮춤
      const scale = Math.min(window.devicePixelRatio || 1, 1.25, 1800 / window.innerWidth);
      canvas!.width = Math.round(window.innerWidth * scale);
      canvas!.height = Math.round(window.innerHeight * scale);
      if (gl && !lost) gl.viewport(0, 0, canvas!.width, canvas!.height);
      draw();
    }

    function updateMouse(dt: number) {
      const k = 1 - Math.pow(0.0025, dt);
      mouseX += (mouseTX - mouseX) * k;
      mouseY += (mouseTY - mouseY) * k;
      mouseActive += (mouseActiveTarget - mouseActive) * Math.min(1, dt * 2.5);
      for (const p of trail) p.age += dt;
    }

    function frame(now: number) {
      raf = 0;
      if (paused || document.hidden || lost) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      time += dt * BASE_SPEED * speed;
      last = now;
      updateMouse(dt);
      draw();
      raf = requestAnimationFrame(frame);
    }

    function start() {
      cancelAnimationFrame(raf);
      last = performance.now();
      if (!paused && !document.hidden && !lost && program) raf = requestAnimationFrame(frame);
    }

    function setup() {
      try {
        gl = canvas!.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'low-power' });
        if (!gl) throw new Error('WebGL unavailable');
        const ctx = gl;
        const compile = (type: number, src: string) => {
          const shader = ctx.createShader(type)!;
          ctx.shaderSource(shader, src);
          ctx.compileShader(shader);
          if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) throw new Error(ctx.getShaderInfoLog(shader) ?? '');
          return shader;
        };
        const highp = ctx.getShaderPrecisionFormat(ctx.FRAGMENT_SHADER, ctx.HIGH_FLOAT)?.precision;
        program = ctx.createProgram()!;
        ctx.attachShader(program, compile(ctx.VERTEX_SHADER, VERTEX));
        ctx.attachShader(program, compile(ctx.FRAGMENT_SHADER, FRAGMENT.replace('highp', highp ? 'highp' : 'mediump')));
        ctx.linkProgram(program);
        if (!ctx.getProgramParameter(program, ctx.LINK_STATUS)) throw new Error(ctx.getProgramInfoLog(program) ?? '');
        ctx.useProgram(program);

        const buffer = ctx.createBuffer();
        ctx.bindBuffer(ctx.ARRAY_BUFFER, buffer);
        ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), ctx.STATIC_DRAW);
        const attr = ctx.getAttribLocation(program, 'a');
        ctx.enableVertexAttribArray(attr);
        ctx.vertexAttribPointer(attr, 2, ctx.FLOAT, false, 0, 0);

        uniforms = {};
        for (const key of ['resolution', 'time', 'mode', 'mouse', 'mouseActive', 'trailPos', 'trailAge']) {
          uniforms[key] = ctx.getUniformLocation(program, key);
        }
        lost = false;
        showFallback(false);
        resize();
        start();
      } catch {
        program = null;
        showFallback(true);
      }
    }

    function setMouse(clientX: number, clientY: number) {
      mouseTX = clientX / window.innerWidth;
      mouseTY = 1 - clientY / window.innerHeight;
      mouseActiveTarget = 1;
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        mouseActiveTarget = 0;
      }, 2200);
      if (mode === 3) pushTrail(mouseTX, mouseTY);
      // 정지 상태(움직임 줄이기)에서는 바로 반영해서 한 번만 그림
      if (paused) {
        mouseX = mouseTX;
        mouseY = mouseTY;
        mouseActive = 1;
        draw();
      }
    }

    const onPointerMove = (e: PointerEvent) => setMouse(e.clientX, e.clientY);
    const onPointerLeave = () => {
      mouseActiveTarget = 0;
    };
    // 방명록: 클릭(탭)한 자리에 빛 흔적
    const onPointerDown = (e: PointerEvent) => {
      if (mode !== 3) return;
      setMouse(e.clientX, e.clientY);
      pushTrail(mouseTX, mouseTY, true);
    };
    const onContextLost = (e: Event) => {
      e.preventDefault();
      lost = true;
      cancelAnimationFrame(raf);
      showFallback(true);
    };
    const onReduceChange = () => {
      paused = reduce.matches;
      start();
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', start);
    reduce.addEventListener('change', onReduceChange);
    canvas.addEventListener('webglcontextlost', onContextLost);
    canvas.addEventListener('webglcontextrestored', setup);

    setup();

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(idleTimer);
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', start);
      reduce.removeEventListener('change', onReduceChange);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      canvas.removeEventListener('webglcontextrestored', setup);
      if (gl && program) gl.deleteProgram(program);
    };
  }, [mode, speed]);

  return (
    <div
      className={clsx('ambient-collection-bg', className)}
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: FALLBACK_BG }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />
    </div>
  );
}
