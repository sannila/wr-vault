import { Component, Input, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserType } from '../../models/model';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardModule,
    FormsModule,
    HttpClientModule,
    InputGroupModule,
    InputGroupAddonModule,
    ButtonModule,
    DropdownModule,
    ToastModule,
  ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css',
})
export class AddUserComponent implements OnInit {
  @Input() isEditAction: boolean = false;
  @Input() userID: number | null = null;

  userRegistrationForm!: FormGroup;
  formError: string = '';
  userTypeOption: any[] = [];

  password =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

  constructor(
    private httpService: HttpService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.userRegistrationFormInialization();
    if (this.isEditAction && this.userID != null) {
      this.getUserDetails();
    }
    this.userTypeOption = [
      { name: 'User', code: UserType.User },
      { name: 'Admin', code: UserType.Admin },
    ];
  }

  userRegistrationFormInialization() {
    this.userRegistrationForm = this.fb.group({
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: this.isEditAction
        ? new FormControl('')
        : new FormControl('', [
            Validators.required,
            Validators.pattern(this.password),
          ]),
      role: new FormControl(null, Validators.required),
    });
  }

  getUserDetails() {
    console.log('getUserDetails', this.userID);
    this.httpService.get(`users/user/${this.userID}`).subscribe((res) => {
      console.log('res', res);
      this.userRegistrationForm.patchValue(res);
    });
  }

  get UserFormControl() {
    return this.userRegistrationForm.controls;
  }
  onSubmit() {
    console.log('onSubmit', this.userRegistrationForm);
    this.httpService
      .post('users/register', this.userRegistrationForm.value)
      .subscribe(
        (res) => {
          console.log('res', res);
          this.userRegistrationForm.reset();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: res.message,
          });
        },
        (error) => {
          console.log('error', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.error,
          });
        }
      );
  }
}
