import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthRequestDto } from '../dto/auth-request.dto';
import { RegisterRequestDto } from '../dto/register-request.dto';
import { AuthResponse } from '../dto/auth-response.dto';  // Assurez-vous que ce chemin est correct


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  

  private apiUrl = 'http://localhost:5181/api/auth';  // Assurez-vous que votre API est sur cette URL

  constructor(private http: HttpClient) { }

  // Méthode pour l'inscription
  register(userData: RegisterRequestDto): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }

  // Méthode pour la connexion
  login(credentials: AuthRequestDto): Observable<AuthResponse> {  // Typage de la réponse
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials);
  }

  // Méthode pour rediriger l'utilisateur vers la page d'authentification
  redirectToAuthServer(redirectUri: string): void {
    // Redirige vers la page d'authentification avec un paramètre de redirection dynamique
    const authUrl = `http://localhost:4200/auth?redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = authUrl;
  }
}
