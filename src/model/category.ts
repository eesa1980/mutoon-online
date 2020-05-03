

export interface Categories {
  data: Data;
}

interface Data {
  allWordpressCategory: AllWordpressCategory;
}

interface AllWordpressCategory {
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
}
