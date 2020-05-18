export interface Fluid {
  base64: string;
  aspectRatio: number;
  src: string;
  srcSet: string;
  sizes: string;
}

export interface ChildImageSharp {
  fluid: Fluid;
}

export interface GatsbyImage {
  childImageSharp: ChildImageSharp;
}
