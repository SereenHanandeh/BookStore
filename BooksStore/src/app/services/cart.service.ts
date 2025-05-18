import { Injectable } from '@angular/core';
import { Book } from '../models/books.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: any[] = [];
  private cartItemsCount = new BehaviorSubject<number>(0);
  cartItemsCount$ = this.cartItemsCount.asObservable();

  constructor() {
    this.loadCart();
    this.updateCartCount();
  }

  addToCart(book: Book) {
    const existing = this.cart.find((item) => item.book.id === book.id);
    if (existing) {
      existing.quantity++;
    } else {
      this.cart.push({ book, quantity: 1 });
    }
    this.saveCart();
    this.updateCartCount();
  }

  getItems() {
    return this.cart;
  }

  updateQuantity(bookId: number, quantity: number) {
    const item = this.cart.find((item) => item.book.id === bookId);
    if (item) {
      item.quantity = quantity > 0 ? quantity : 1;
      this.saveCart();
      this.updateCartCount();
    }
  }

  removeItem(bookId: number) {
    this.cart = this.cart.filter((item) => item.book.id !== bookId);
    this.saveCart();
    this.updateCartCount();
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
    this.updateCartCount();
  }

  private saveCart() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }
  }

  private loadCart() {
    if (typeof window !== 'undefined' && localStorage.getItem('cart')) {
      const data = localStorage.getItem('cart');
      this.cart = data ? JSON.parse(data) : [];
    } else {
      this.cart = [];
    }
  }

  private updateCartCount() {
    const totalCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    this.cartItemsCount.next(totalCount);
  }
}
