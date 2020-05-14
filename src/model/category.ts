export interface AllWordpressCategory {
  edges: CategoryEdge[];
}

export interface CategoryEdge {
  node: Category;
}

export interface Category {
  name: string;
  wordpress_parent: number;
  slug: string;
  wordpress_id: number;
  offsets: { [key: string]: number[] };
  audio_file: string;
  parent_element: {
    name: string;
  };
}
