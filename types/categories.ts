export interface Category {
  id: string;
  name: string;
  nameAr: string;
  icon: string;
  slug: string;
  displayOrder: number;
  productsCount: number;
}

export interface CategoryForm {
  name: string;
  nameAr: string;
  icon: string;
  slug: string;
  displayOrder: number;
}
