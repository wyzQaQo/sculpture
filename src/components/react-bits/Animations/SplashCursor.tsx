'use client';
import { useEffect, useRef } from 'react';

interface SplashCursorProps {
  SIM_RESOLUTION?: number;
  DYE_RESOLUTION?: number;
  DENSITY_DISSIPATION?: number;
  VELOCITY_DISSIPATION?: number;
  PRESSURE?: number;
  PRESSURE_ITERATIONS?: number;
  CURL?: number;
  SPLAT_RADIUS?: number;
  SPLAT_FORCE?: number;
  SHADING?: boolean;
  COLOR_UPDATE_SPEED?: number;
  TRANSPARENT?: boolean;
  RAINBOW_MODE?: boolean;
  COLOR?: string;
}

export default function SplashCursor({
  SIM_RESOLUTION = 128, DYE_RESOLUTION = 1440, DENSITY_DISSIPATION = 3.5,
  VELOCITY_DISSIPATION = 2, PRESSURE = 0.1, PRESSURE_ITERATIONS = 20, CURL = 3,
  SPLAT_RADIUS = 0.2, SPLAT_FORCE = 6000, SHADING = true, COLOR_UPDATE_SPEED = 10,
  TRANSPARENT = true, RAINBOW_MODE = true, COLOR = '#5B5B5B'
}: SplashCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) return;
    let isActive = true;

    interface PointerState { id: number; texcoordX: number; texcoordY: number; prevTexcoordX: number; prevTexcoordY: number; deltaX: number; deltaY: number; down: boolean; moved: boolean; color: number[]; }
    function createPointer(): PointerState {
      return { id: -1, texcoordX: 0, texcoordY: 0, prevTexcoordX: 0, prevTexcoordY: 0, deltaX: 0, deltaY: 0, down: false, moved: false, color: [0, 0, 0] };
    }

    const pointers: PointerState[] = [createPointer()];

    const config = {
      SIM_RESOLUTION, DYE_RESOLUTION, DENSITY_DISSIPATION, VELOCITY_DISSIPATION,
      PRESSURE, PRESSURE_ITERATIONS, CURL, SPLAT_RADIUS, SPLAT_FORCE,
      SHADING, COLOR_UPDATE_SPEED, PAUSED: false, TRANSPARENT, RAINBOW_MODE,
      COLOR
    };

    function getWebGLContext(canvas: HTMLCanvasElement) {
      const params = { alpha: true, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false };
      const gl = (canvas.getContext('webgl2', params) || canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params)) as WebGLRenderingContext;
      const isWebGL2 = !!(canvas.getContext('webgl2', params) as WebGL2RenderingContext | null);
      let halfFloat: OES_texture_half_float | null = null;
      let supportLinearFiltering: OES_texture_half_float_linear | null = null;
      if (isWebGL2) { gl.getExtension('EXT_color_buffer_float'); supportLinearFiltering = gl.getExtension('OES_texture_float_linear'); }
      else { halfFloat = gl.getExtension('OES_texture_half_float'); supportLinearFiltering = gl.getExtension('OES_texture_half_float_linear'); }
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      const halfFloatTexType = isWebGL2 ? (gl as WebGL2RenderingContext).HALF_FLOAT : halfFloat?.HALF_FLOAT_OES;
      let formatRGBA: { internalFormat: number; format: number } | null, formatRG: { internalFormat: number; format: number } | null, formatR: { internalFormat: number; format: number } | null;
      if (isWebGL2) {
        const gl2 = gl as WebGL2RenderingContext;
        formatRGBA = getSupportedFormat(gl, gl2.RGBA16F, gl.RGBA, halfFloatTexType!);
        formatRG = getSupportedFormat(gl, gl2.RG16F, gl2.RG, halfFloatTexType!);
        formatR = getSupportedFormat(gl, gl2.R16F, gl2.RED, halfFloatTexType!);
      } else { formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType!); formatRG = formatR = formatRGBA; }
      return { gl, ext: { formatRGBA, formatRG, formatR, halfFloatTexType, supportLinearFiltering } };
    }

    function getSupportedFormat(gl: WebGLRenderingContext, internalFormat: number, format: number, type: number) {
      if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
        const gl2 = gl as WebGL2RenderingContext;
        switch (internalFormat) {
          case gl2.R16F: return getSupportedFormat(gl, gl2.RG16F, gl2.RG, type);
          case gl2.RG16F: return getSupportedFormat(gl, gl2.RGBA16F, gl.RGBA, type);
          default: return null;
        }
      }
      return { internalFormat, format };
    }

    function supportRenderTextureFormat(gl: WebGLRenderingContext, internalFormat: number, format: number, type: number) {
      const texture = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
      const fbo = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      return gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    }

    class Material {
      vertexShader: WebGLShader; fragmentShaderSource: string;
      programs: WebGLProgram[] = []; activeProgram: WebGLProgram | null = null; uniforms: Record<string, WebGLUniformLocation> = {};
      constructor(vertexShader: WebGLShader, fragmentShaderSource: string) { this.vertexShader = vertexShader; this.fragmentShaderSource = fragmentShaderSource; }
      setKeywords(keywords: string[]) {
        let hash = 0; for (let i = 0; i < keywords.length; i++) hash += hashCode(keywords[i]);
        let program = this.programs[hash];
        if (!program) { const fragmentShader = compileShader(gl.FRAGMENT_SHADER, this.fragmentShaderSource, keywords); program = createProgram(this.vertexShader, fragmentShader); this.programs[hash] = program; }
        if (program === this.activeProgram) return; this.uniforms = getUniforms(program); this.activeProgram = program;
      }
      bind() { gl.useProgram(this.activeProgram); }
    }

    class Program {
      uniforms: Record<string, WebGLUniformLocation>; program: WebGLProgram;
      constructor(vertexShader: WebGLShader, fragmentShader: WebGLShader) { this.program = createProgram(vertexShader, fragmentShader); this.uniforms = getUniforms(this.program); }
      bind() { gl.useProgram(this.program); }
    }

    function createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
      const program = gl.createProgram()!; gl.attachShader(program, vertexShader); gl.attachShader(program, fragmentShader); gl.linkProgram(program);
      return program;
    }

    function getUniforms(program: WebGLProgram) {
      const uniforms: Record<string, WebGLUniformLocation> = {};
      const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < uniformCount; i++) { const info = gl.getActiveUniform(program, i); if (info) uniforms[info.name] = gl.getUniformLocation(program, info.name)!; }
      return uniforms;
    }

    function compileShader(type: number, source: string, keywords?: string[]) {
      source = keywords ? addKeywords(source, keywords) : source;
      const shader = gl.createShader(type)!; gl.shaderSource(shader, source); gl.compileShader(shader);
      return shader;
    }

    function addKeywords(source: string, keywords: string[]) {
      let keywordsString = ''; keywords.forEach(k => { keywordsString += '#define ' + k + '\n'; }); return keywordsString + source;
    }

    function hashCode(s: string) { let hash = 0; for (let i = 0; i < s.length; i++) { hash = (hash << 5) - hash + s.charCodeAt(i); hash |= 0; } return hash; }

    function hexToRGB(hex: string) { const val = hex.replace('#', ''); const r = parseInt(val.slice(0, 2), 16) / 255; const g = parseInt(val.slice(2, 4), 16) / 255; const b = parseInt(val.slice(4, 6), 16) / 255; return [r * 0.15, g * 0.15, b * 0.15]; }

    function HSVtoRGB(h: number, s: number, v: number) {
      let r = 0, g = 0, b = 0;
      const i = Math.floor(h * 6), f = h * 6 - i, p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s);
      switch (i % 6) { case 0: r = v; g = t; b = p; break; case 1: r = q; g = v; b = p; break; case 2: r = p; g = v; b = t; break; case 3: r = p; g = q; b = v; break; case 4: r = t; g = p; b = v; break; case 5: r = v; g = p; b = q; break; }
      return [r, g, b];
    }

    function generateColor() {
      if (!RAINBOW_MODE) return hexToRGB(COLOR);
      const c = HSVtoRGB(Math.random(), 1.0, 1.0); return [c[0] * 0.15, c[1] * 0.15, c[2] * 0.15];
    }

    const { gl, ext } = getWebGLContext(canvas);
    if (!ext.supportLinearFiltering) { config.DYE_RESOLUTION = 256; config.SHADING = false; }

    const baseVertexShader = compileShader(gl.VERTEX_SHADER, `precision highp float; attribute vec2 aPosition; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB; uniform vec2 texelSize; void main () { vUv = aPosition * 0.5 + 0.5; vL = vUv - vec2(texelSize.x, 0.0); vR = vUv + vec2(texelSize.x, 0.0); vT = vUv + vec2(0.0, texelSize.y); vB = vUv - vec2(0.0, texelSize.y); gl_Position = vec4(aPosition, 0.0, 1.0); }`);
    const copyShader = compileShader(gl.FRAGMENT_SHADER, `precision mediump float; precision mediump sampler2D; varying highp vec2 vUv; uniform sampler2D uTexture; void main () { gl_FragColor = texture2D(uTexture, vUv); }`);
    const clearShader = compileShader(gl.FRAGMENT_SHADER, `precision mediump float; precision mediump sampler2D; varying highp vec2 vUv; uniform sampler2D uTexture; uniform float value; void main () { gl_FragColor = value * texture2D(uTexture, vUv); }`);

    const displayShaderSource = `precision highp float; precision highp sampler2D; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB; uniform sampler2D uTexture; uniform vec2 texelSize;
      void main () {
        vec3 c = texture2D(uTexture, vUv).rgb;
        #ifdef SHADING
          vec3 lc = texture2D(uTexture, vL).rgb; vec3 rc = texture2D(uTexture, vR).rgb;
          vec3 tc = texture2D(uTexture, vT).rgb; vec3 bc = texture2D(uTexture, vB).rgb;
          float dx = length(rc) - length(lc); float dy = length(tc) - length(bc);
          vec3 n = normalize(vec3(dx, dy, length(texelSize)));
          float diffuse = clamp(dot(n, vec3(0.0, 0.0, 1.0)) + 0.7, 0.7, 1.0); c *= diffuse;
        #endif
        float a = max(c.r, max(c.g, c.b)); gl_FragColor = vec4(c, a);
      }`;

    const splatShader = compileShader(gl.FRAGMENT_SHADER, `precision highp float; precision highp sampler2D; varying vec2 vUv; uniform sampler2D uTarget; uniform float aspectRatio; uniform vec3 color; uniform vec2 point; uniform float radius;
      void main () { vec2 p = vUv - point.xy; p.x *= aspectRatio; vec3 splat = exp(-dot(p, p) / radius) * color; vec3 base = texture2D(uTarget, vUv).xyz; gl_FragColor = vec4(base + splat, 1.0); }`);

    const advectionShader = compileShader(gl.FRAGMENT_SHADER, `precision highp float; precision highp sampler2D; varying vec2 vUv; uniform sampler2D uVelocity; uniform sampler2D uSource; uniform vec2 texelSize; uniform vec2 dyeTexelSize; uniform float dt; uniform float dissipation;
      vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) { vec2 st = uv / tsize - 0.5; vec2 iuv = floor(st); vec2 fuv = fract(st);
        vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize); vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
        vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize); vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
        return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y); }
      void main () { vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize; vec4 result = bilerp(uSource, coord, dyeTexelSize); float decay = 1.0 + dissipation * dt; gl_FragColor = result / decay; }`);

    const divergenceShader = compileShader(gl.FRAGMENT_SHADER, `precision mediump float; precision mediump sampler2D; varying highp vec2 vUv; varying highp vec2 vL; varying highp vec2 vR; varying highp vec2 vT; varying highp vec2 vB; uniform sampler2D uVelocity;
      void main () { float L = texture2D(uVelocity, vL).x; float R = texture2D(uVelocity, vR).x; float T = texture2D(uVelocity, vT).y; float B = texture2D(uVelocity, vB).y;
        vec2 C = texture2D(uVelocity, vUv).xy; if (vL.x < 0.0) L = -C.x; if (vR.x > 1.0) R = -C.x; if (vT.y > 1.0) T = -C.y; if (vB.y < 0.0) B = -C.y;
        float div = 0.5 * (R - L + T - B); gl_FragColor = vec4(div, 0.0, 0.0, 1.0); }`);
    const curlShader = compileShader(gl.FRAGMENT_SHADER, `precision mediump float; precision mediump sampler2D; varying highp vec2 vUv; varying highp vec2 vL; varying highp vec2 vR; varying highp vec2 vT; varying highp vec2 vB; uniform sampler2D uVelocity;
      void main () { float L = texture2D(uVelocity, vL).y; float R = texture2D(uVelocity, vR).y; float T = texture2D(uVelocity, vT).x; float B = texture2D(uVelocity, vB).x; float vorticity = R - L - T + B; gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0); }`);
    const vorticityShader = compileShader(gl.FRAGMENT_SHADER, `precision highp float; precision highp sampler2D; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB; uniform sampler2D uVelocity; uniform sampler2D uCurl; uniform float curl; uniform float dt;
      void main () { float L = texture2D(uCurl, vL).x; float R = texture2D(uCurl, vR).x; float T = texture2D(uCurl, vT).x; float B = texture2D(uCurl, vB).x; float C = texture2D(uCurl, vUv).x;
        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L)); force /= length(force) + 0.0001; force *= curl * C; force.y *= -1.0;
        vec2 velocity = texture2D(uVelocity, vUv).xy; velocity += force * dt; velocity = min(max(velocity, -1000.0), 1000.0); gl_FragColor = vec4(velocity, 0.0, 1.0); }`);
    const pressureShader = compileShader(gl.FRAGMENT_SHADER, `precision mediump float; precision mediump sampler2D; varying highp vec2 vUv; varying highp vec2 vL; varying highp vec2 vR; varying highp vec2 vT; varying highp vec2 vB; uniform sampler2D uPressure; uniform sampler2D uDivergence;
      void main () { float L = texture2D(uPressure, vL).x; float R = texture2D(uPressure, vR).x; float T = texture2D(uPressure, vT).x; float B = texture2D(uPressure, vB).x; float C = texture2D(uPressure, vUv).x; float divergence = texture2D(uDivergence, vUv).x; float pressure = (L + R + B + T - divergence) * 0.25; gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0); }`);
    const gradientSubtractShader = compileShader(gl.FRAGMENT_SHADER, `precision mediump float; precision mediump sampler2D; varying highp vec2 vUv; varying highp vec2 vL; varying highp vec2 vR; varying highp vec2 vT; varying highp vec2 vB; uniform sampler2D uPressure; uniform sampler2D uVelocity;
      void main () { float L = texture2D(uPressure, vL).x; float R = texture2D(uPressure, vR).x; float T = texture2D(uPressure, vT).x; float B = texture2D(uPressure, vB).x; vec2 velocity = texture2D(uVelocity, vUv).xy; velocity.xy -= vec2(R - L, T - B); gl_FragColor = vec4(velocity, 0.0, 1.0); }`);

    const blit = (() => {
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0); gl.enableVertexAttribArray(0);
      return (target: { width: number; height: number; fbo: WebGLFramebuffer } | null, clear = false) => {
        if (!target) { gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight); gl.bindFramebuffer(gl.FRAMEBUFFER, null); }
        else { gl.viewport(0, 0, target.width, target.height); gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo); }
        if (clear) { gl.clearColor(0.0, 0.0, 0.0, 1.0); gl.clear(gl.COLOR_BUFFER_BIT); }
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      };
    })();

    function createFBO(w: number, h: number, internalFormat: number, format: number, type: number, param: number) {
      gl.activeTexture(gl.TEXTURE0); const texture = gl.createTexture()!; gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);
      const fbo = gl.createFramebuffer()!; gl.bindFramebuffer(gl.FRAMEBUFFER, fbo); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.viewport(0, 0, w, h); gl.clear(gl.COLOR_BUFFER_BIT);
      return { texture, fbo, width: w, height: h, texelSizeX: 1.0 / w, texelSizeY: 1.0 / h, attach: (id: number) => { gl.activeTexture(gl.TEXTURE0 + id); gl.bindTexture(gl.TEXTURE_2D, texture); return id; } };
    }

    function createDoubleFBO(w: number, h: number, internalFormat: number, format: number, type: number, param: number) {
      let fbo1 = createFBO(w, h, internalFormat, format, type, param), fbo2 = createFBO(w, h, internalFormat, format, type, param);
      return { width: w, height: h, texelSizeX: fbo1.texelSizeX, texelSizeY: fbo1.texelSizeY, get read() { return fbo1; }, set read(v) { fbo1 = v; }, get write() { return fbo2; }, set write(v) { fbo2 = v; }, swap() { [fbo1, fbo2] = [fbo2, fbo1]; } };
    }

    const copyProgram = new Program(baseVertexShader, copyShader);
    const clearProgram = new Program(baseVertexShader, clearShader);
    const splatProgram = new Program(baseVertexShader, splatShader);
    const advectionProgram = new Program(baseVertexShader, advectionShader);
    const divergenceProgram = new Program(baseVertexShader, divergenceShader);
    const curlProgram = new Program(baseVertexShader, curlShader);
    const vorticityProgram = new Program(baseVertexShader, vorticityShader);
    const pressureProgram = new Program(baseVertexShader, pressureShader);
    const gradienSubtractProgram = new Program(baseVertexShader, gradientSubtractShader);
    const displayMaterial = new Material(baseVertexShader, displayShaderSource);

    function getResolution(resolution: number) {
      let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
      if (aspectRatio < 1) aspectRatio = 1.0 / aspectRatio;
      const min = Math.round(resolution), max = Math.round(resolution * aspectRatio);
      return gl.drawingBufferWidth > gl.drawingBufferHeight ? { width: max, height: min } : { width: min, height: max };
    }

    function scaleByPixelRatio(input: number) { return Math.floor(input * (window.devicePixelRatio || 1)); }

    function initFramebuffers() {
      const simRes = getResolution(config.SIM_RESOLUTION), dyeRes = getResolution(config.DYE_RESOLUTION);
      const texType = ext.halfFloatTexType!, rgba = ext.formatRGBA!, rg = ext.formatRG!, r = ext.formatR!;
      const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;
      return { dye: createDoubleFBO(dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering),
        velocity: createDoubleFBO(simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering),
        divergence: createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST),
        curl: createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST),
        pressure: createDoubleFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST) };
    }

    let buffers = initFramebuffers();
    let lastUpdateTime = Date.now();
    let colorUpdateTimer = 0.0;

    function updateFrame() {
      if (!isActive) return;
      const now = Date.now(); const dt = Math.min((now - lastUpdateTime) / 1000, 0.016666); lastUpdateTime = now;

      if (canvas.width !== scaleByPixelRatio(canvas.clientWidth) || canvas.height !== scaleByPixelRatio(canvas.clientHeight)) {
        canvas.width = scaleByPixelRatio(canvas.clientWidth); canvas.height = scaleByPixelRatio(canvas.clientHeight);
        buffers = initFramebuffers();
      }

      colorUpdateTimer += dt * config.COLOR_UPDATE_SPEED;
      if (colorUpdateTimer >= 1) { colorUpdateTimer = 0; pointers.forEach(p => { p.color = generateColor(); }); }

      pointers.forEach(p => { if (p.moved) { p.moved = false; splatPointer(p); } });

      gl.disable(gl.BLEND);
      curlProgram.bind(); gl.uniform2f(curlProgram.uniforms.texelSize, buffers.velocity.texelSizeX, buffers.velocity.texelSizeY); gl.uniform1i(curlProgram.uniforms.uVelocity, buffers.velocity.read.attach(0)); blit(buffers.curl);
      vorticityProgram.bind(); gl.uniform2f(vorticityProgram.uniforms.texelSize, buffers.velocity.texelSizeX, buffers.velocity.texelSizeY); gl.uniform1i(vorticityProgram.uniforms.uVelocity, buffers.velocity.read.attach(0)); gl.uniform1i(vorticityProgram.uniforms.uCurl, buffers.curl.attach(1)); gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL); gl.uniform1f(vorticityProgram.uniforms.dt, dt); blit(buffers.velocity.write); buffers.velocity.swap();
      divergenceProgram.bind(); gl.uniform2f(divergenceProgram.uniforms.texelSize, buffers.velocity.texelSizeX, buffers.velocity.texelSizeY); gl.uniform1i(divergenceProgram.uniforms.uVelocity, buffers.velocity.read.attach(0)); blit(buffers.divergence);
      clearProgram.bind(); gl.uniform1i(clearProgram.uniforms.uTexture, buffers.pressure.read.attach(0)); gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE); blit(buffers.pressure.write); buffers.pressure.swap();
      pressureProgram.bind(); gl.uniform2f(pressureProgram.uniforms.texelSize, buffers.velocity.texelSizeX, buffers.velocity.texelSizeY); gl.uniform1i(pressureProgram.uniforms.uDivergence, buffers.divergence.attach(0));
      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) { gl.uniform1i(pressureProgram.uniforms.uPressure, buffers.pressure.read.attach(1)); blit(buffers.pressure.write); buffers.pressure.swap(); }
      gradienSubtractProgram.bind(); gl.uniform2f(gradienSubtractProgram.uniforms.texelSize, buffers.velocity.texelSizeX, buffers.velocity.texelSizeY); gl.uniform1i(gradienSubtractProgram.uniforms.uPressure, buffers.pressure.read.attach(0)); gl.uniform1i(gradienSubtractProgram.uniforms.uVelocity, buffers.velocity.read.attach(1)); blit(buffers.velocity.write); buffers.velocity.swap();
      advectionProgram.bind(); gl.uniform2f(advectionProgram.uniforms.texelSize, buffers.velocity.texelSizeX, buffers.velocity.texelSizeY); gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, buffers.velocity.texelSizeX, buffers.velocity.texelSizeY); const vId = buffers.velocity.read.attach(0); gl.uniform1i(advectionProgram.uniforms.uVelocity, vId); gl.uniform1i(advectionProgram.uniforms.uSource, vId); gl.uniform1f(advectionProgram.uniforms.dt, dt); gl.uniform1f(advectionProgram.uniforms.dissipation, config.VELOCITY_DISSIPATION); blit(buffers.velocity.write); buffers.velocity.swap();
      gl.uniform1i(advectionProgram.uniforms.uVelocity, buffers.velocity.read.attach(0)); gl.uniform1i(advectionProgram.uniforms.uSource, buffers.dye.read.attach(1)); gl.uniform1f(advectionProgram.uniforms.dissipation, config.DENSITY_DISSIPATION); blit(buffers.dye.write); buffers.dye.swap();

      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.enable(gl.BLEND);
      displayMaterial.bind(); if (config.SHADING) gl.uniform2f(displayMaterial.uniforms.texelSize, 1.0 / buffers.dye.width, 1.0 / buffers.dye.height);
      gl.uniform1i(displayMaterial.uniforms.uTexture, buffers.dye.read.attach(0)); blit(null);

      animationFrameId.current = requestAnimationFrame(updateFrame);
    }

    function splatPointer(pointer: PointerState) { splat(pointer.texcoordX, pointer.texcoordY, pointer.deltaX * config.SPLAT_FORCE, pointer.deltaY * config.SPLAT_FORCE, pointer.color); }
    function clickSplat(pointer: PointerState) {
      const color = generateColor(); color[0] *= 10; color[1] *= 10; color[2] *= 10;
      splat(pointer.texcoordX, pointer.texcoordY, 10 * (Math.random() - 0.5), 30 * (Math.random() - 0.5), color);
    }

    function splat(x: number, y: number, dx: number, dy: number, color: number[]) {
      splatProgram.bind(); gl.uniform1i(splatProgram.uniforms.uTarget, buffers.velocity.read.attach(0)); gl.uniform1f(splatProgram.uniforms.aspectRatio, canvas.width / canvas.height); gl.uniform2f(splatProgram.uniforms.point, x, y);
      gl.uniform3f(splatProgram.uniforms.color, dx, dy, 0.0); gl.uniform1f(splatProgram.uniforms.radius, (canvas.width / canvas.height > 1 ? config.SPLAT_RADIUS / 100 * (canvas.width / canvas.height) : config.SPLAT_RADIUS / 100)); blit(buffers.velocity.write); buffers.velocity.swap();
      gl.uniform1i(splatProgram.uniforms.uTarget, buffers.dye.read.attach(0)); gl.uniform3f(splatProgram.uniforms.color, color[0], color[1], color[2]); blit(buffers.dye.write); buffers.dye.swap();
    }

    function updatePointerDownData(p: PointerState, id: number, posX: number, posY: number) { p.id = id; p.down = true; p.moved = false; p.texcoordX = posX / canvas.width; p.texcoordY = 1.0 - posY / canvas.height; p.prevTexcoordX = p.texcoordX; p.prevTexcoordY = p.texcoordY; p.deltaX = 0; p.deltaY = 0; p.color = generateColor(); }

    const handleMouseDown = (e: MouseEvent) => { const p = pointers[0]; updatePointerDownData(p, -1, scaleByPixelRatio(e.clientX), scaleByPixelRatio(e.clientY)); clickSplat(p); };
    const handleMouseMove = (e: MouseEvent) => { const p = pointers[0]; const px = scaleByPixelRatio(e.clientX), py = scaleByPixelRatio(e.clientY); p.prevTexcoordX = p.texcoordX; p.prevTexcoordY = p.texcoordY; p.texcoordX = px / canvas.width; p.texcoordY = 1.0 - py / canvas.height; const ar = canvas.width / canvas.height; p.deltaX = ar < 1 ? (p.texcoordX - p.prevTexcoordX) * ar : (p.texcoordX - p.prevTexcoordX); p.deltaY = ar > 1 ? (p.texcoordY - p.prevTexcoordY) / ar : (p.texcoordY - p.prevTexcoordY); p.moved = Math.abs(p.deltaX) > 0 || Math.abs(p.deltaY) > 0; };
    const handleTouchStart = (e: TouchEvent) => { for (let i = 0; i < e.targetTouches.length; i++) updatePointerDownData(pointers[0], e.targetTouches[i].identifier, scaleByPixelRatio(e.targetTouches[i].clientX), scaleByPixelRatio(e.targetTouches[i].clientY)); };
    const handleTouchMove = (e: TouchEvent) => { const p = pointers[0]; for (let i = 0; i < e.touches.length; i++) { const px = scaleByPixelRatio(e.touches[i].clientX), py = scaleByPixelRatio(e.touches[i].clientY); p.prevTexcoordX = p.texcoordX; p.prevTexcoordY = p.texcoordY; p.texcoordX = px / canvas.width; p.texcoordY = 1.0 - py / canvas.height; p.moved = true; } };
    const handleTouchEnd = () => { pointers[0].down = false; };

    window.addEventListener('mousedown', handleMouseDown); window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouchStart); window.addEventListener('touchmove', handleTouchMove, false); window.addEventListener('touchend', handleTouchEnd);
    updateFrame();

    return () => {
      isActive = false;
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener('mousedown', handleMouseDown); window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart); window.removeEventListener('touchmove', handleTouchMove); window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, zIndex: 50, pointerEvents: 'none', width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ width: '100vw', height: '100vh', display: 'block' }} />
    </div>
  );
}
