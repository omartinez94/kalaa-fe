export interface MenuItem {
  nombre: string;
  precio: number;
  descripcion: string;
  slug?: string;
  emoji?: string;
  imagen?: string;
  gallery?: string[];
}

export interface MenuData {
  entradas: MenuItem[];
  principales: MenuItem[];
  bebidas: MenuItem[];
  postres: MenuItem[];
}
