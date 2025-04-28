export interface Product {
  id: string;
  description: string;
  brand: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CompanyInfo {
  name: string;
  phone: string;
  address: string;
  date: string;
  clientName: string;
  logo?: string; // Base64 encoded image
}

export interface Quote {
  companyInfo: CompanyInfo;
  products: Product[];
  subtotal: number;
  vatAmount: number;
  vatRate: number;
} 