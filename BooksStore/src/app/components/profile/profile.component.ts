import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: any = {};
  isEditing: boolean = false;
  defaultImage: string = 'assets/default-profile.jpg'; 
  userId: number = 1;

  constructor(private authService: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.userId = this.user.id;
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveProfile(): void {
    this.http.put(`http://localhost:3000/users/${this.userId}`, this.user).subscribe(() => {
       this.authService.setAuth(this.user);
      this.isEditing = false;
      alert('Profile updated successfully!');
    });
  }

  onImageChange(event: any): void {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    this.user.image = reader.result; 
  };
  reader.readAsDataURL(file);
}
}
