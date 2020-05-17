export interface AllAudio {
  nodes: AudioNode[];
}

export interface AudioNode {
  id: string;
  src?: Src;
  book_id: string;
  name: string;
  offset: string;
}

interface Src {
  publicURL: string;
}
