import type Swiper from "../swiper-class.js";

export interface ZoomMethods {
  /**
   * Whether the zoom module is enabled
   */
  enabled: boolean;

  /**
   * Current image scale ratio
   */
  scale: number;

  /**
   * Enable zoom module
   */
  enable(): void;

  /**
   * Disable zoom module
   */
  disable(): void;

  /**
   * Zoom in image of the currently active slide. Optionally accepts custom zoom ratio
   */
  in(ratio?: number): void;

  /**
   * Zoom out image of the currently active slide
   */
  out(): void;

  /**
   * Toggle image zoom of the currently active slide
   */
  toggle(event?: MouseEvent | TouchEvent | PointerEvent): void;
}

export interface ZoomEvents {
  /**
   * Event will be fired on zoom change
   */
  zoomChange: (
    swiper: Swiper,
    scale: number,
    imageEl: HTMLElement,
    slideEl: HTMLElement,
  ) => void;
}

export interface ZoomOptions {
  /**
   * When set to true, the image will not be scaled past 100% of its original size
   *
   * @default false
   */
  limitToOriginalSize?: boolean;
  /**
   * Maximum image zoom multiplier
   *
   * @default 3
   */
  maxRatio?: number;
  /**
   * Minimal image zoom multiplier
   *
   * @default 1
   */
  minRatio?: number;
  /**
   * When set to true, a zoomed in image will automatically pan while moving the mouse over the image
   *
   * @default false
   */
  panOnMouseMove?: boolean;
  /**
   * Enable/disable zoom-in by slide's double tap
   *
   * @default true
   */
  toggle?: boolean;
  /**
   * CSS class name of zoom container
   *
   * @default 'swiper-zoom-container'
   */
  containerClass?: string;
  /**
   * CSS class name of zoomed in container
   *
   * @default 'swiper-slide-zoomed'

   */
  zoomedSlideClass?: string;
}
