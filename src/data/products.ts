export type ProductCategory = "זרים" | "בוקסים" | "הפקות";

export type Product = {
  id: number;
  name: string;
  category: ProductCategory;
  description: string;
  price: number;
  preparationDays: number;
  image: string;
};

export const products: Product[] = [
  {
    id: 1,
    name: "זר מון רוז",
    category: "זרים",
    description: "זר ורדים רומנטי ועדין בגווני ורוד ולבן",
    price: 180,
    preparationDays: 2,
    image: "",
  },
  {
    id: 2,
    name: "בוקס אלגנט",
    category: "בוקסים",
    description: "בוקס פרחים יוקרתי בעיצוב נקי ומודרני",
    price: 240,
    preparationDays: 3,
    image: "",
  },
  {
    id: 3,
    name: "עיצוב פרחים להפקה",
    category: "הפקות",
    description: "עיצוב פרחים מותאם אישית להפקות ואירועים",
    price: 650,
    preparationDays: 7,
    image: "",
  },
];
