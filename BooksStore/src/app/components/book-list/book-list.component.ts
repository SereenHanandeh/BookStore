import { Component } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/books.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-list',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss'],
})
export class BookListComponent {
  books: Book[] = [];
  searchQuery: string = '';
  selectedCategory: string = '';
  noResults: boolean = false;
  isLoading = false;

  constructor(
    private bookService: BookService,
    private cartService: CartService,
    private router: Router,
    public authService: AuthService
  ) {}

  get uniqueCategories() {
    return [...new Set(this.books.map((book) => book.category))];
  }

  get filteredBooks() {
    const filtered = this.books.filter(
      (book) =>
        (this.selectedCategory === '' ||
          book.category === this.selectedCategory) &&
        (book.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(this.searchQuery.toLowerCase()))
    );

    // Set noResults to true if no books are found
    this.noResults = filtered.length === 0;
    return filtered;
  }

  ngOnInit(): void {
    this.bookService.getBooks().subscribe((data) => {
      this.books = data;
      this.isLoading = false;
    });
  }

  addToCart(book: Book) {
    if (!this.authService.isAuthenticated()) {
      alert('Please log in to add books to cart.');
      this.router.navigate(['/login']);
      return;
    }

    this.cartService.addToCart(book);
    alert(`${book.title} added to cart`);
  }

  deleteBook(bookId: number): void {
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(bookId).subscribe(() => {
        this.books = this.books.filter((b) => b.id !== bookId);
      });
    }
  }

  editBook(bookId: number): void {
    this.router.navigate(['/books/edit', bookId]);
  }
}
