import { Component, Inject, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
  FormBuilder,
} from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ButtonModule } from 'primeng/button';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { HttpClientModule } from '@angular/common/http';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';
import { LoaderComponent } from '../../common/loader/loader.component';
import { CommonModule, DOCUMENT } from '@angular/common';
import { error } from 'console';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    CardModule,
    ReactiveFormsModule,
    InputGroupAddonModule,
    InputGroupModule,
    ButtonModule,
    InputIconModule,
    InputTextModule,
    HttpClientModule,
    LoaderComponent,
    CommonModule,
  ],
  providers: [HttpService],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export class SignInComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  loginError!: string;

  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.submitted = false;
    this.formInitialization();
  }

  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  formInitialization() {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.loginError = '';
    if (this.loginForm.valid) {
      console.log('onSubmit', this.loginForm.value);
      this.httpService
        .post('users/login', this.loginForm.value)
        .subscribe(
          (res) => {
            if (res) {
              console.log('res', res);
              localStorage.setItem('authToken', res.token);
              localStorage.setItem('email', this.loginForm.get('email')?.value);
              environment.userEmail = res.user.email;
              environment.role = res.user.role;
              environment.userID = res.user.user_id;
              environment.username = res.user.username;
              this.router.navigate(['index']);
            }
          },
          (error) => {
            console.log('error', error);
            this.loginError = error.error.errorMessage;
            this.submitted = false;
          }
        )

        // .subscribe({
        //   next: (res) => {
        //     console.log('res', res);
        //     localStorage.setItem('authToken', res.token);
        //     localStorage.setItem('email');
        //     this.router.navigate(['index']);
        //   },
        //   error: (error) => {
        //     console.log('error', error);
        //     this.loginError = error.error.errorMessage;
        //     this.submitted = false;
        //   },
        // });
    }
  }
}
