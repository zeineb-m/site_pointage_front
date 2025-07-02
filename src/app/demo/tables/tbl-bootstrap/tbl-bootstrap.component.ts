import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { UserService } from 'src/app/user';

@Component({
  selector: 'app-tbl-bootstrap',
  standalone: true,
  imports: [SharedModule,RouterLink],
  templateUrl: './tbl-bootstrap.component.html',
  styleUrls: ['./tbl-bootstrap.component.scss']
})
export class TblBootstrapComponent implements OnInit {
  user = {
    username: '',
    email: '',
    password: '',
    role: 'ADMIN'
  };

  users: any[] = [];
  selectedFile!: File;
constructor(private userService: UserService, private router: Router) {}
  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
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
      next: () => {
        alert('Utilisateur créé !');
        this.loadUsers();
      },
      error: (err) => alert('Erreur : ' + err.message)
    });
  }

editUser(user: any) {
  this.router.navigate(['/forms', user.id]);
}

  deleteUser(user: any) {
    if (confirm(`Are you sure you want to delete user ${user.username} ?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          alert('User deleted');
          this.loadUsers();
        },
        error: err => alert('Error deleting user: ' + err.message)
      });
    }
  }
}
