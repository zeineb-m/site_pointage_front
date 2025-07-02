import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../user';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user.html'
})
export class UserComponent implements OnInit {
  user = {
    username: '',
    email: '',
    password: '',
    role: 'ADMIN'
  };

  users: any[] = [];
  selectedFile!: File;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getAllUsers().subscribe({
      next: (res) => {
        this.users = res.map(u => {
          if (u.photo) {
            u.photo = `http://localhost:8081/users/photo/${u.photo}`;
          }
          return u;
        });
      },
      error: (err) => console.error('Erreur chargement utilisateurs', err)
    });
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    if (!this.selectedFile) {
      alert('Photo requise');
      return;
    }

    this.userService.createUser(this.user, this.selectedFile).subscribe({
      next: (res) => alert('Utilisateur créé !'),
      error: (err) => alert('Erreur : ' + err.message)
    });
  }
}
