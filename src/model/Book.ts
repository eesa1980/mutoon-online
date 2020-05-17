export interface AllBook {
  nodes: BookNode[];
}

export interface BookNode {
  category_id: string;
  id: string;
  slug: string;
  title: string;
  content: Content[];
}

export interface Content {
  ar: string;
  en: string;
  page_number?: number;
}
