import { GatsbyImage } from "./image";

export interface AllCategory {
  nodes: CategoryNode[];
  group: Group[];
}

export interface CategoryNode {
  id: string;
  avatar?: GatsbyImage;
  description?: string;
  name: string;
  parent_id: string;
  slug: string;
}

interface Group {
  nodes: CategoryNode[];
}
