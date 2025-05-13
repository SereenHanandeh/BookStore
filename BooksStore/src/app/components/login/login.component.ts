import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { TranslatePipe } from '../../pips/translate.pipe';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, TranslatePipe],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  rememberMe: boolean = false;

  private translate = inject(TranslateService);

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    if (!this.email || !this.password) {
      alert('Please enter both email and password.');
      return;
    }

    // Send login data to the auth service
    this.authService.login(this.email, this.password).subscribe((users) => {
      if (users.length > 0) {
        const user = users[0];
        this.authService.setAuth(user); // Assuming this sets authentication data

        // Check if Remember Me is enabled
        if (this.rememberMe) {
          // Save user data in localStorage if Remember Me is checked
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          // Optionally, you can use sessionStorage for the current session
          sessionStorage.setItem('user', JSON.stringify(user));
        }

        alert('Login successful!');

        if (this.authService.isAdmin()) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/books']);
        }
      } else {
        alert('Invalid email or password.');
      }
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }
}
