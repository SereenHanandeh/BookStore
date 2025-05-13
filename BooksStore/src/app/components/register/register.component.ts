import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule,RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  user = {
    name: '',
    email: '',
    password: '',
    role: 'user',
  };

  confirmPassword: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  get passwordMismatch(): boolean {
    return (
      !!this.user.password &&
      !!this.confirmPassword &&
      this.user.password !== this.confirmPassword
    );
  }

  get passwordStrength(): string {
    const password = this.user.password;
    if (password.length < 8) return 'Weak';
    if (/[A-Z]/.test(password) && /\d/.test(password) && /[!@#$%^&*]/.test(password)) return 'Strong';
    return 'Medium';
  }

  get hasUpperCase(): boolean {
    return /[A-Z]/.test(this.user.password);
  }

  get hasNumber(): boolean {
    return /\d/.test(this.user.password);
  }

  get hasSpecialChar(): boolean {
    return /[!@#$%^&*]/.test(this.user.password);
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  register(): void {
    if (
      !this.user.name ||
      !this.user.email ||
      !this.user.password ||
      !this.confirmPassword
    ) {
      alert('Please fill in all fields.');
      return;
    }

    if (this.passwordMismatch) {
      alert('Passwords do not match.');
      return;
    }

    this.http
      .get<any[]>(`http://localhost:3000/users?email=${this.user.email}`)
      .subscribe((existingUsers) => {
        if (existingUsers.length > 0) {
          alert('Email is already in use.');
        } else {
          this.authService.register(this.user).subscribe(() => {
            alert('Registration successful. You can now log in.');
            this.router.navigate(['/login']);
          });
        }
      });
  }
}
