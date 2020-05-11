export interface AllWordpressWpBooks {
  group: BookGroup[];
}

export interface AllWordpressWpBooksUngrouped {
  edges: BookEdge[];
}

interface BookGroup {
  edges: BookEdge[];
}

export interface BookEdge {
  node: Page;
}

export interface Page {
  wordpress_id: number;
  acf: Acf;
  slug: string;
  categories: Category[];
}

interface Category {
  slug: string;
}

interface Acf {
  arabic: string;
  english: string;
  book_title: string;
  cover_image?: Coverimage;
  page_number: number;
  audio?: {
    localFile: {
      publicURL: string;
    };
  };
}

interface Coverimage {
  alt: string;
  url: string;
}
