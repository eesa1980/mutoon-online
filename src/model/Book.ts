export interface Book {
  _id: string;
  name: string;
  category_id: string;
  slug: string;
  content: {
    en: string;
    ar: string;
  }[];
}
