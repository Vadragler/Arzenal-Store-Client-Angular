import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, CommonModule, InputTextModule, ButtonModule, PasswordModule, FloatLabelModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  userInscForm: FormGroup;
  token: string | null = null;
  tokenIsValid: boolean = false;
  loading: boolean = true;
  serverUnavailable: boolean = false;
  title = 'inscription';
  serverAvailable: boolean = true;
  passwordCriteria = {
    hasLowerCase: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSymbol: false,
    hasMinLength: false
  };
  mediumRegex = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[!#$%^&*(),.?":|<>]).{10,}$';
  strongRegex = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!#$%^&*(),.?":|<>]).{14,}$';
  specialCharacter: string = '!#$%^&*(),.?":|<>';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {
    this.userInscForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!#$%^&*(),.?":|<>]).{8,}$/)]),
      confirmpassword: new FormControl('', [Validators.required])
    });
  }


  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    // Vérifie la disponibilité du serveur dès l'initialisation
    
    if (this.token) {
      this.http.get(`http://localhost:5181/api/invite/validate?token=${this.token}`)
        .subscribe({
          next: () => {
            this.tokenIsValid = true;
            this.serverUnavailable = false;
            this.loading = false;
            this.userInscForm.get('password')?.valueChanges.subscribe(password => {
              this.passwordCriteria.hasLowerCase = /[a-z]/.test(password);
              this.passwordCriteria.hasUpperCase = /[A-Z]/.test(password);
              this.passwordCriteria.hasNumber = /\d/.test(password);
              this.passwordCriteria.hasSymbol = /[!#$%^&*(),.?":|<>]/.test(password);
              this.passwordCriteria.hasMinLength = password?.length >= 8;
            });
          },
          error: (error: HttpErrorResponse) => {
            if (error.status === 503 ||error.status === 0) {
              // Si le serveur est indisponible, on gère l'erreur ici
              this.tokenIsValid = false;
              this.loading = false;
              this.serverUnavailable = true;
            } else {
              // Pour toutes les autres erreurs (404, 500, etc.), on met également à jour le statut
              this.tokenIsValid = false;
              this.loading = false;
              this.serverUnavailable = false;
            }
          }
        });
    } else {
      this.loading = false;

    }
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmpassword')?.value;

    if (password !== confirmPassword) {
      formGroup.get('confirmpassword')?.setErrors({ match: true });
    } else {
      formGroup.get('confirmpassword')?.setErrors(null);
    }
  }

  isInvalidTouchedOrDirty(userControl: FormControl) {
    return userControl.invalid && (userControl.touched || userControl.dirty);
  }

  isValidTouchedOrDirty(userControl: FormControl) {
    return userControl.valid && (userControl.touched || userControl.dirty);
  }

  onSubmit() {
    this.userInscForm.markAllAsTouched();

    if (this.userInscForm.invalid || !this.tokenIsValid || !this.token) {
      return;
    }

    const formData = this.userInscForm.value;

    this.http.post('http://localhost:5181/api/auth/register', {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      token: this.token
    }).subscribe({
      next: (response) => {
        console.log('Réponse du serveur:', response);
              alert('Inscription réussie !');
              this.router.navigate(['/login']);  // ou la page de ton choix
            },
      error: (err) => {
              alert('Erreur inconnue survenue');
              console.error('Erreur dans la réponse:', err);
              console.error('Code d\'erreur:', err.status);
              console.error('Détails:', err.message);
            }
          });
      
    
  }

}
