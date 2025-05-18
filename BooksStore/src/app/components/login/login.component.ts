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
    alert('❗ Please enter both email and password.');
    return;
  }

  this.authService.getUsersByEmail(this.email).subscribe((users) => {
    if (users.length === 0) {
      alert('🚫 This email is not registered.');
      return;
    }

    const encodedPassword = btoa(this.password);
    const matchedUser = users.find(user => user.password === encodedPassword);

    if (!matchedUser) {
      alert('🚫 Incorrect email or password.');
      return;
    }

    // ✅ Successful login
    this.authService.setAuth(matchedUser);

    if (this.rememberMe) {
      localStorage.setItem('user', JSON.stringify(matchedUser));
    } else {
      sessionStorage.setItem('user', JSON.stringify(matchedUser));
    }

    alert('✅ Login successful!');

    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/books']);
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
