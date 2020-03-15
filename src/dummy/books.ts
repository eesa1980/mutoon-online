import { Book, Category } from "../model";

export const categories: Category[] = [
  {
    _id: "9o23745938oeiyruq",
    name: "Aqeedah"
  },
  {
    _id: "89078078907456897350",
    name: "Arabic"
  }
];

export const books: Book[] = [
  {
    _id: "8943658934654",
    name: "Conditions Laa Ilaaha ill Allah",
    category_id: "9o23745938oeiyruq",
    slug: "shuroot-laa-ilaaha-illallah",
    content: [
      {
        en: "This is page 1 En",
        ar: "This is page 1 Ar"
      },
      {
        en: "This is page 2 En",
        ar: "This is page 2 Ar"
      }
    ]
  },
  {
    _id: "7864387016530856381765",
    name: "Three fundamental principles",
    category_id: "9o23745938oeiyruq",
    slug: "three-fundamental-principles",
    content: [
      {
        en: "This is page 1 En",
        ar: "This is page 1 Ar"
      },
      {
        en: "This is page 2 En",
        ar: "This is page 2 Ar"
      },
      {
        en: "This is page 3 En",
        ar: "This is page 3 Ar"
      }
    ]
  },
  {
    _id: "908098340937590437",
    name: "Al Ajooroomiyah",
    category_id: "89078078907456897350",
    slug: "al-ajooroomiyah",
    content: [
      {
        en: "This is page 1 En",
        ar: "This is page 1 Ar"
      },
      {
        en: "This is page 2 En",
        ar: "This is page 2 Ar"
      },
      {
        en: "This is page 3 En",
        ar: "This is page 3 Ar"
      }
    ]
  }
];
