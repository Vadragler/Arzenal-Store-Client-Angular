import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, ViewEncapsulation,  OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { AppComponent } from '../../app.component';
import { UpdateAccountDto } from '../../dto/update-account-dto';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FluidModule } from 'primeng/fluid';
import { PanelModule } from 'primeng/panel';




@Component({
  selector: 'app-account',
  imports: [ButtonModule, DialogModule, PanelModule, ConfirmPopupModule, FluidModule, FloatLabelModule, CardModule, InputTextModule,CommonModule, ConfirmDialogModule, ToastModule, FormsModule, ReactiveFormsModule, PasswordModule],
  providers: [ConfirmationService],
  templateUrl: './account.component.html',
  standalone: true,
  styleUrl: './account.component.css',
})




export class AccountComponent implements OnInit {
  token: any;
  visibleDeleteProfil: boolean = false;
  visibleModifyInformation: boolean = false;
  visibleModifyPassword: boolean = false;
  username: string | null = null;
  email: string | null = null;
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


  passwordForm: FormGroup;

  constructor(
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService,
    
  ) {
    this.passwordForm = new FormGroup({
      actualpassword: new FormControl('', Validators.required),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!#$%^&*(),.?":|<>]).{10,}$/)
      ]),
      confirmpassword: new FormControl('', Validators.required)
    }, { validators: this.passwordMatchValidator });

  }

  isInvalidTouchedOrDirty(userControl: AbstractControl) {
    return userControl.invalid && (userControl.touched || userControl.dirty);
  }

  passwordMatchValidator(formGroup: AbstractControl): null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmpassword')?.value;

    if (password !== confirmPassword) {
      formGroup.get('confirmpassword')?.setErrors({ match: true });
    } else {
      const errors = formGroup.get('confirmpassword')?.errors;
      if (errors) {
        delete errors['match'];
        if (Object.keys(errors).length === 0) {
          formGroup.get('confirmpassword')?.setErrors(null);
        } else {
          formGroup.get('confirmpassword')?.setErrors(errors);
        }
      }
    }
    return null;
  }


  ModifyPassword() {
    this.passwordForm.markAllAsTouched();
    

    if (this.passwordForm.invalid) {
      this.passwordForm.reset();
      return;
    }
    var updatepassword: UpdateAccountDto;
    updatepassword = {
      Username: null,
      Email: null,
      ActualPassword: this.passwordForm.value.actualpassword,
      NewPassword: this.passwordForm.value.password
    }
    this.http.patch('http://localhost:5181/api/account/me', updatepassword, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    }).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Mot de passe modifié',
          detail: 'Modification du mot de passe effectué avec succès.',
          life: 3000
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'La modification a échoué.',
          life: 3000
        })
      }
    });
    this.passwordForm.reset();
    this.visibleModifyPassword = false;
  }

  DeleteProfil() {
    
    this.http.delete('http://localhost:5181/api/account/me', {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    }).subscribe({
      next: () => {
        this.router.navigate(['/login'])
          
            // Une fois que la navigation est terminée, afficher le toast
            this.messageService.add({
              severity: 'success',
              summary: 'Compte supprimé',
              detail: 'Votre compte a été supprimé avec succès.',
              life: 3000
            });
          

      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'La suppression a échoué.',
          life: 3000
        })
      }
    });
    this.visibleDeleteProfil = false;
  }

  ModifyInformation() {
    var updateaccount: UpdateAccountDto;
    updateaccount = {
      Username: this.username,
      Email: this.email,
      ActualPassword: null,
      NewPassword: null
    }
    this.http.patch('http://localhost:5181/api/account/me', updateaccount,{
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })
    }).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Compte modifié',
          detail: 'Modification effectué avec succès.',
          life: 3000
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'La modification a échoué.',
          life: 3000
        })
      }
    });
    this.visibleModifyInformation = false;
  }
  

  ngOnInit(): void {
   
    // Vérifie la disponibilité du serveur dès l'initialisation
     const token = localStorage.getItem('authToken');

   
    this.http.get('http://localhost:5181/api/account/me', {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    }).subscribe({
      next: (user: any) => {
        this.username = user.username;
        this.email = user.email;
      }
    });
    this.token = token;
    this.passwordForm.get('password')?.valueChanges.subscribe(password => {
      this.passwordCriteria.hasLowerCase = /[a-z]/.test(password);
      this.passwordCriteria.hasUpperCase = /[A-Z]/.test(password);
      this.passwordCriteria.hasNumber = /\d/.test(password);
      this.passwordCriteria.hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      this.passwordCriteria.hasMinLength = password?.length >= 10;
    });
  }

  }

