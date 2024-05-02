import { Coords } from "./kakaoMap";

interface StoreItems {
  itemId: string;
  item: string;
  category: string;
  price: number;
}

export interface StoreData {
  storeId: string;
  storeName: string;
  phoneNumber: string;
  address: string;
  items: StoreItems[];
  position: Coords;
}

export interface StoreCategory {
  category: string;
  minPrice: number;
  maxPrice: number;
}
