import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  isLoggedIn = false;
  userName = '';
  userImage = '';
  userRole = '';
  cartItemCount = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;

      const user = this.authService.getUser();
      if (user) {
        this.userName = user.name;
        this.userImage = user.image || '👤';
        this.userRole = user.role || '';
      }
    });
    this.cartService.cartItemsCount$.subscribe((count) => {
      this.cartItemCount = count;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
