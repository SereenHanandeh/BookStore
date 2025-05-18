import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/books.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-book',
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-book.component.html',
  styleUrl: './edit-book.component.scss'
})
export class EditBookComponent {
 bookId!: number;
  book: Book = {
    id: 0,
    title: '',
    author: '',
    category: '',
    price: 0,
    cover: '',
    description: '',
    stock: 0
  };
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.bookId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadBook();
  }

  loadBook() {
    this.bookService.getBookById(this.bookId).subscribe({
      next: (data) => {
        this.book = data;
        this.isLoading = false;
      },
      error: (err) => {
        alert('Failed to load book data.');
        this.isLoading = false;
      }
    });
  }

  saveBook() {
    this.bookService.updateBook(this.book).subscribe({
      next: () => {
        alert('Book updated successfully!');
        this.router.navigate(['/books']);
      },
      error: () => {
        alert('Failed to update book.');
      }
    });
  }
}
