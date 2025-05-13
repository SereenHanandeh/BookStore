import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/books.model';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss'],
})
export class BookDetailsComponent implements OnInit {
  book: Book | null = null;
  bookId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.bookId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.bookId) {
      this.bookService.getBookById(this.bookId).subscribe((data) => {
        this.book = data;
      });
    }
  }

  // دالة إضافة الكتاب إلى السلة
  addToCart(book: Book) {
    if (!this.authService.isAuthenticated()) {
      alert('Please log in to add books to cart.');
      this.router.navigate(['/login']);
      return;
    }

    this.cartService.addToCart(book);
    alert(`${book.title} added to cart`);
  }
}
