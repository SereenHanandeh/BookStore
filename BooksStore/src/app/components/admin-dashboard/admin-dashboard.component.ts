import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent {
  users: any[] = [];
  selectedUser: any = null;
  editForm!: FormGroup;

  constructor(private http: HttpClient, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loadUsers();
    this.editForm = this.fb.group({
      name: [''],
      email: [''],
      role: [''],
    });
  }

  loadUsers() {
    this.http.get<any[]>('http://localhost:3000/users').subscribe({
      next: (data) => {
        this.users = data.filter((user) => user.role === 'user');
      },
      error: (err) => {
        console.error('Error loading users:', err);
        alert('Failed to load users');
      },
    });
  }

  deleteUser(id: number) {
    if (confirm('هل أنت متأكد من حذف المستخدم؟')) {
      this.http.delete(`http://localhost:3000/users/${id}`).subscribe({
        next: () => {
          alert('تم حذف المستخدم');
          this.loadUsers(); // إعادة تحميل المستخدمين بعد الحذف
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          alert('فشل حذف المستخدم');
        },
      });
    }
  }

  editUser(user: any) {
    this.selectedUser = user;
    this.editForm.patchValue(user); 
  }

  saveUserChanges() {
    if (!this.selectedUser) return;

    const updatedUser = this.editForm.value;

    this.http
      .put(`http://localhost:3000/users/${this.selectedUser.id}`, updatedUser)
      .subscribe({
        next: () => {
          alert('تم تعديل المستخدم');
          this.selectedUser = null;
          this.loadUsers();
        },
        error: (err) => {
          console.error('Error updating user:', err);
          alert('فشل تعديل المستخدم');
        },
      });
  }

  cancelEdit() {
    this.selectedUser = null;
    this.editForm.reset();
  }
}
