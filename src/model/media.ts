export interface AllWordpressWpMedia {
  nodes: Node[];
}

interface Node {
  media_type: string;
  alt_text: string;
  title: string;
  categories: Category[];
  localFile: LocalFile;
}

interface LocalFile {
  childImageSharp: ChildImageSharp;
}

interface ChildImageSharp {
  id: string;
  fluid: Fluid;
}

interface Fluid {
  base64: string;
  aspectRatio: number;
  src: string;
  srcSet: string;
  sizes: string;
}

interface Category {
  name: string;
}
