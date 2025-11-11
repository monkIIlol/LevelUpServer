export interface User {
  run: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: string;
  region: string;
  comuna: string;
  address: string;
  birthDate: string | null;
}

export interface AuthContextType {
  currentUser: User | null; 
  login: (user: User) => void;   
  logout: () => void;           
  register: (user: User) => void; 
}

export interface Product {
code: string;
category: string;
name: string;
price: number;
img: string;
desc: string;
details: string[];
stock?: number; 
}

export interface CartItem {
code: string;
name: string;
price: number;
qty: number;
}

export interface CartContextType {
cartItems: CartItem[];
totalPrice: number; 
addToCart: (code: string) => void;
increaseQty: (code: string) => void; 
decreaseQty: (code: string) => void; 
removeFromCart: (code: string) => void; 
clearCart: () => void; 
}

export interface BlogPost {
id: string; 
title: string;
summary: string; 
imageUrl: string;
content: string; 
}

export interface Comment {
id: string;
author: string; 
text: string;
timestamp: string; 
}


export interface ContactoMensaje {
id: string; 
name: string;
email: string;
comment: string;
timestamp: string; 
}