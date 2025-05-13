import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Book } from '../../models/books.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent {
  cartItems: { book: Book; quantity: number }[] = [];
  total = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.cartItems = this.cartService.getItems();
    this.calculateTotal();
  }

  calculateTotal() {
    this.total = this.cartItems.reduce(
      (sum, item) => sum + +item.book.price * item.quantity,
      0
    );
  }

  changeQuantity(bookId: number, event: any) {
    const quantity = +event.target.value;
    if (quantity > 0) {
      this.cartService.updateQuantity(bookId, quantity);
      this.loadCart();
    }
  }

  removeItem(bookId: number) {
    this.cartService.removeItem(bookId);
    this.loadCart();
  }

  clearCart() {
    this.cartService.clearCart();
    this.cartItems = [];
    this.total = 0;
  }

 checkout() {
  alert('Payment successful! Thank you for your purchase.');
  this.clearCart(); 
}

}
