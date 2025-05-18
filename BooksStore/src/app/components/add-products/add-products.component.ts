import { Component, ViewEncapsulation } from '@angular/core';
import { BookService } from '../../services/book.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Book } from '../../models/books.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-add-products',
  imports: [FormsModule, CommonModule, DialogModule],
  templateUrl: './add-products.component.html',
  styleUrl: './add-products.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AddProductsComponent {
  // خصائص مودال
  displayModal: boolean = false;
  modalMessage: string = '';

  book: Omit<Book, 'id'> = {
    title: '',
    author: '',
    price: 0,
    description: '',
    cover: '',
    category: '',
    stock: 0,
  };

  constructor(
    private bookService: BookService,
    private authService: AuthService,
    private router: Router
  ) {}

  addBook(): void {
    if (!this.authService.isAdmin()) {
      this.showModal('Only admin can add books.');
      return;
    }

    if (
      !this.book.title ||
      !this.book.author ||
      !this.book.price ||
      !this.book.category ||
      !this.book.cover
    ) {
      this.showModal('Please fill in all required fields.');
      return;
    }

    this.bookService.addBook(this.book).subscribe(() => {
      this.showModal('Book added successfully!');
      this.router.navigate(['/books']);
    });
  }

  showModal(message: string) {
    this.modalMessage = message;
    this.displayModal = true;
  }

  onModalHide() {
    this.displayModal = false;
    if (this.modalMessage === 'Book added successfully!') {
      this.router.navigate(['/books']);
    }
  }
}
