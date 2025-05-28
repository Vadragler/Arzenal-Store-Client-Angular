import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';  // <-- Assure-toi de bien importer ces modules

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AuthRequestDto } from '../dto/auth-request.dto';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthResponse } from '../dto/auth-response.dto';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FluidModule } from 'primeng/fluid';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule, PasswordModule, FloatLabelModule, FluidModule, CardModule, PanelModule], // <-- Assure-toi d'importer les modules nécessaires ici

})
export class LoginComponent {
  title = 'Connexion';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) { }

 
    // Formulaire avec reactive forms
    userForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),  // Validation email
      password: new FormControl('', [Validators.required])
    });

  
  

  

  // Fonction pour vérifier si un contrôle est invalidé et a été touché ou modifié
  isInvalidTouchedOrDirty(userControl: FormControl) {
    return userControl.invalid && (userControl.touched || userControl.dirty);
  }

  // Fonction de soumission du formulaire
  onSubmit() {
    this.userForm.markAllAsTouched();

    if (this.userForm.invalid) {
      return;
    }

    const formData = this.userForm.value;

    const authRequest: AuthRequestDto = {
      email: formData.email!,
      password: formData.password!
    };
    console.log('Login payload:', authRequest); // 👈 debug ici
    this.authService.login(authRequest).subscribe({
      next: (response: AuthResponse) => {  // Typage de la réponse ici
        // Stockage du token JWT dans le localStorage (ou autre méthode de ton choix)
        this.messageService.add({
          severity: 'success',
          summary: 'Connexion réussie',
          detail: 'Bienvenue',
          life: 3000
        })
        localStorage.setItem('authToken', response.token);
        const token = response.token; // Réponse de l'API
        this.authService.redirectToAuthServer(token)
        console.log(`token : ${token}`);
        this.route.queryParams.subscribe(params => {
          const redirectUri = params['redirect_uri'];
          console.log('Redirect URI:', redirectUri);
        const redirectToWpfUrl = `${redirectUri}?token=${token}`;

        // Redirige vers l'URL de redirection (ton serveur WPF)
          window.location.href = redirectToWpfUrl;
        });
        // Redirection après connexion
        //this.router.navigate(['/account']);  // Ajuste la route si nécessaire
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'La connexion à échoué, identifiant ou mot de passe incorect',
            life: 3000
          })
        } else if (error.status === 503 || error.status === 0) {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'La connexion à échoué, serveur indisponible',
            life: 3000
          })
        } console.log(error); // 👈 debug ici
        // Tu peux afficher un message d'erreur dans l'interface utilisateur ici
      }
    });
  }



}
