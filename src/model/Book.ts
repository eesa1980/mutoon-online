export interface Book {
  _id: string;
  title: string;
  content: [
    {
      en: string;
      ar: string;
    }
  ];
}
