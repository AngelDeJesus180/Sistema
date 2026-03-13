import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  mode: 'login' | 'register' = 'login';
  loginForm: FormGroup;
  registerForm: FormGroup;
  loading = false;
  error = '';
  successMsg = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', Validators.required]
    });
  }

  setMode(m: 'login' | 'register') {
    this.mode = m;
    this.error = '';
    this.successMsg = '';
  }

  onLogin(): void {
    if (this.loginForm.invalid || this.loading) return;
    this.loading = true;
    this.error = '';
    this.auth.login(this.loginForm.value).subscribe({
      next: () => { this.loading = false; this.router.navigate(['/catalog']); },
      error: (err) => {
        this.loading = false;
        this.error = err.status === 401 ? 'Usuario o contraseña incorrectos' : 'Error al conectar';
      }
    });
  }

  onRegister(): void {
    if (this.registerForm.invalid || this.loading) return;
    const { username, password, confirmPassword } = this.registerForm.value;
    if (password !== confirmPassword) { this.error = 'Las contraseñas no coinciden'; return; }
    this.loading = true;
    this.error = '';
    this.auth.register({ username, password, role: 'ROLE_USER' }).subscribe({
      next: () => {
        this.loading = false;
        this.successMsg = '¡Cuenta creada! Ahora puedes iniciar sesión.';
        this.registerForm.reset();
        setTimeout(() => this.setMode('login'), 2000);
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 200 || err.status === 0) {
          this.successMsg = '¡Cuenta creada! Ahora puedes iniciar sesión.';
          this.registerForm.reset();
          setTimeout(() => this.setMode('login'), 2000);
        } else if (err.status === 409) {
          this.error = 'Ese usuario ya existe';
        } else {
          this.error = 'Error al registrar';
        }
      }
    });
  }
}
