import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { UserAuthService } from '../UserAuthService';
import { UserService } from '../user';

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
    role: ''
  };

  users: any[] = [];
  selectedFile!: File;
  availableRoles: string[] = [];
  errors: { [key: string]: string } = {};

  constructor(
    private userService: UserService,
    private userAuth: UserAuthService
  ) {}

  ngOnInit() {
    const connectedRole = this.userAuth.getRole();

    if (connectedRole === 'ADMIN') {
      this.availableRoles = ['HR', 'SITE_SUPERVISOR'];
    } else if (connectedRole === 'SITE_SUPERVISOR') {
      this.availableRoles = ['EMPLOYEE'];
    } else {
      this.availableRoles = [];
    }

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
    this.errors = {};

    if (this.availableRoles.length === 0) {
      alert("Vous n'avez pas le droit de créer un utilisateur.");
      return;
    }

    if (!this.selectedFile) {
      this.errors['file'] = 'Photo requise';
      return;
    }

    const creatorId = this.userAuth.getId();

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('user', JSON.stringify(this.user));
    formData.append('creatorId', creatorId);

    this.userService.createUserFormData(formData).subscribe({
      next: (res) => {
        alert('Utilisateur créé !');
        this.errors = {};
      },
      error: (err) => {
        this.errors = {};

        if (err.error && err.error.messages && Array.isArray(err.error.messages)) {
          this.errors['global'] = err.error.messages.join(' ');
        } else if (typeof err.error === 'string') {
          this.errors['global'] = err.error;
        } else {
          this.errors['global'] = 'Erreur inconnue';
        }
      }
    });
  }
}
