import { Injectable } from '@angular/core';
import { Book } from '../models/books.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: any[] = [];

  constructor() {
    this.loadCart();
  }

  addToCart(book: Book) {
    const existing = this.cart.find(item => item.book.id === book.id);
    if (existing) {
      existing.quantity++;
    } else {
      this.cart.push({ book, quantity: 1 });
    }
    this.saveCart();
  }

  getItems() {
    return this.cart;
  }

  updateQuantity(bookId: number, quantity: number) {
    const item = this.cart.find(item => item.book.id === bookId);
    if (item) {
      item.quantity = quantity > 0 ? quantity : 1;
      this.saveCart();
    }
  }

  removeItem(bookId: number) {
    this.cart = this.cart.filter(item => item.book.id !== bookId);
    this.saveCart();
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
  }

  private saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  private loadCart() {
    const data = localStorage.getItem('cart');
    this.cart = data ? JSON.parse(data) : [];
  }
}
