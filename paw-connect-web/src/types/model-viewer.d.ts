export {};

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & {
          src?: string | null;
          alt?: string;
          'camera-controls'?: string;
          'auto-rotate'?: string;
          'rotation-per-second'?: string;
          ar?: string;
          arModes?: string;
          'ar-scale'?: string;
          'camera-orbit'?: string;
          'field-of-view'?: string;
          'interaction-prompt'?: string;
          'interaction-prompt-threshold'?: string;
          'max-camera-orbit'?: string;
          'min-camera-orbit'?: string;
          'shadow-intensity'?: string;
          'shadow-softness'?: string;
          exposure?: string;
          'tone-mapping'?: string;
          skyboxImage?: string;
          poster?: string;
          reveal?: string;
          loading?: string;
        },
        HTMLElement
      >;
    }
  }
}
