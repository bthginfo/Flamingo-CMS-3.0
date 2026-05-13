/**
 * OGL-powered fluid liquid-metal shader hero.
 * Mouse-reactive caustics layer that sits behind hero text. Falls back to a
 * static gradient when WebGL is unavailable or prefers-reduced-motion is set.
 */
import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';

const VERT = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform vec2  uMouse;
uniform vec2  uRes;
uniform vec3  uColorA;
uniform vec3  uColorB;
uniform vec3  uColorC;

// 2D simplex noise (Ashima)
vec3 mod289(vec3 x){return x - floor(x*(1.0/289.0))*289.0;}
vec2 mod289(vec2 x){return x - floor(x*(1.0/289.0))*289.0;}
vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0))
                          + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = vUv;
  vec2 p  = (uv - 0.5) * vec2(uRes.x / uRes.y, 1.0);
  vec2 m  = (uMouse - 0.5) * vec2(uRes.x / uRes.y, 1.0);

  float t = uTime * 0.18;
  float n1 = snoise(p * 1.6 + vec2(t,        -t * 0.7));
  float n2 = snoise(p * 2.4 + vec2(-t * 0.6,  t * 1.1) + n1);
  float n3 = snoise(p * 0.9 + vec2(t * 0.4,   t * 0.3) + n2 * 0.5);

  float md = exp(-distance(p, m) * 1.6) * 0.55;
  float v  = 0.5 + 0.5 * sin(n1 * 2.4 + n2 * 1.7 + n3 + uTime * 0.4) + md;

  vec3 col = mix(uColorA, uColorB, smoothstep(0.0, 0.7, v));
  col      = mix(col, uColorC, smoothstep(0.55, 1.4, v + md));

  // subtle film grain
  float g = fract(sin(dot(uv * uRes, vec2(12.9898,78.233))) * 43758.5453);
  col += (g - 0.5) * 0.02;

  gl_FragColor = vec4(col, 1.0);
}
`;

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const num = parseInt(full, 16);
  return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
}

export interface ShaderBackdropProps {
  /** Hex colors for the three-stop gradient noise (background → mid → highlight). */
  colors?: [string, string, string];
  className?: string;
}

export function ShaderBackdrop({
  colors = ['#0b1020', '#7C3AED', '#F24171'],
  className = '',
}: ShaderBackdropProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host || typeof window === 'undefined') return;

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      host.style.background = `linear-gradient(135deg, ${colors[0]}, ${colors[1]} 50%, ${colors[2]})`;
      return;
    }

    let renderer: Renderer | null = null;
    try {
      renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 1.6), alpha: false, antialias: false });
    } catch {
      host.style.background = `linear-gradient(135deg, ${colors[0]}, ${colors[1]} 50%, ${colors[2]})`;
      return;
    }
    const gl = renderer.gl;
    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';
    gl.canvas.style.display = 'block';
    host.appendChild(gl.canvas);

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime:   { value: 0 },
        uMouse:  { value: [0.5, 0.5] },
        uRes:    { value: [1, 1] },
        uColorA: { value: hexToRgb(colors[0]) },
        uColorB: { value: hexToRgb(colors[1]) },
        uColorC: { value: hexToRgb(colors[2]) },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    const onResize = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      renderer!.setSize(w, h);
      program.uniforms.uRes.value = [w, h];
    };
    onResize();
    const ro = new ResizeObserver(onResize);
    ro.observe(host);

    const onMove = (e: MouseEvent) => {
      const r = host.getBoundingClientRect();
      program.uniforms.uMouse.value = [
        (e.clientX - r.left) / r.width,
        1 - (e.clientY - r.top) / r.height,
      ];
    };
    host.addEventListener('mousemove', onMove);

    let rafId = 0;
    const start = performance.now();
    const tick = (now: number) => {
      program.uniforms.uTime.value = (now - start) / 1000;
      renderer!.render({ scene: mesh });
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      host.removeEventListener('mousemove', onMove);
      try { host.removeChild(gl.canvas); } catch { /* noop */ }
    };
  }, [colors]);

  return <div ref={ref} aria-hidden className={`absolute inset-0 -z-10 overflow-hidden ${className}`} />;
}
