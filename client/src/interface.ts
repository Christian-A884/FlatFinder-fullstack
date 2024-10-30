export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthdate: string;
  isAdmin: boolean;
  favouriteFlatList: FavFlat[];
  age: number;
  userFlatCount: number;
}

export interface Flat {
  id: string;
  city: string;
  streetName: string;
  streetNumber: number;
  areaSize: number;
  hasAC: boolean;
  yearBuilt: number;
  rentPrice: number;
  description: string;
  dateAvailable: Date;
  isFavourite: boolean;
  ownerLastName: string;
  ownerFirstName: string;
  ownerEmail: string;
  ownerId: string;
  photoURL: string;
  [key: string]: unknown;
}

export interface FavFlat {
  _id: string;
}

export interface Message {
  content: string;
  senderLastname?: string;
  senderFirstname?: string;
  senderEmail?: string;
  flatId?: string;
  createdAt: string;
}
