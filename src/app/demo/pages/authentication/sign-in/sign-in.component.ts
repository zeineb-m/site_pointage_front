import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { UserAuthService } from 'src/app/UserAuthService';


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

  constructor(

    private router: Router,
    private userAuth: UserAuthService 
  ) {}

 onSubmit() {
  this.userAuth.signIn(this.email, this.password).subscribe({
    next: (user) => {
      alert('Bienvenue ' + user.username);

      // Stocker id + rôle de l'utilisateur connecté
      this.userAuth.setUser(user);

      // Rediriger vers une autre page
      this.router.navigate(['/tables']);
    },
    error: (err) => alert('Erreur : ' + err.error)
  });
}

}
