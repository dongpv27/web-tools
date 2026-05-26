// Minimal type declarations for gif.js (no @types package available).
// gif.js encodes animated GIFs in a Web Worker; the public API used by
// GifMakerClient is: new GIF(options), addFrame(canvas, opts), on(event, cb),
// render().
declare module 'gif.js' {
  interface GIFOptions {
    workers?: number;
    quality?: number;
    workerScript?: string;
    width?: number;
    height?: number;
    background?: string;
    repeat?: number;
    transparent?: number | null;
    dither?: boolean | string;
    debug?: boolean;
  }

  interface FrameOptions {
    delay?: number;
    copy?: boolean;
    dispose?: number;
  }

  type GIFEvent = 'start' | 'progress' | 'abort' | 'finished';

  class GIF {
    constructor(options?: GIFOptions);
    addFrame(
      image: CanvasImageSource | CanvasRenderingContext2D,
      options?: FrameOptions,
    ): void;
    on(event: 'progress', callback: (progress: number) => void): void;
    on(event: 'finished', callback: (blob: Blob) => void): void;
    on(event: GIFEvent, callback: (...args: unknown[]) => void): void;
    render(): void;
    abort(): void;
  }

  export default GIF;
}
