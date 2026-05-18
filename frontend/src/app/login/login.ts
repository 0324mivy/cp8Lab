import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  username = '';
  password = '';
  message = '';

  constructor(private loginService: LoginService, private router: Router) {}

  register() {
    this.loginService.register(this.username, this.password).subscribe({
      next: (res: any) => {
        this.message = res.message;
      },
      error: (err) => {
        this.message = err.error.message;
      }
    });
  }

  login() {
    this.loginService.login(this.username, this.password).subscribe({
      next: (res: any) => {
        this.loginService.saveToken(res.token);
        this.router.navigate(['/users']);
      },
      error: (err) => {
        this.message = err.error.message;
      }
    });
  }
}