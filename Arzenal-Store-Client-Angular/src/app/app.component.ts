import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';

import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-root',
  imports: [RouterModule, FormsModule, ToastModule, HttpClientModule],
  providers: [AuthService, MessageService],
  templateUrl: './app.component.html'
})
export class AppComponent{}
