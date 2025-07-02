// angular import
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { UserService } from 'src/app/user';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  email = '';
  password = '';

  constructor(private userService: UserService, private router: Router) {}

  onSubmit() {
    this.userService.signIn(this.email, this.password).subscribe({
      next: (user) => {
        alert('Bienvenue ' + user.username);
        // tu peux stocker le user dans localStorage ici
        this.router.navigate(['/tables']); // ou dashboard
      },
      error: (err) => alert('Erreur : ' + err.error)
    });
  }
}