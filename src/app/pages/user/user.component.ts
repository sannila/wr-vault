import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from '../../common/header/header.component';
import { DockModule } from 'primeng/dock';
import { Router } from '@angular/router';
import { UserListComponent } from '../user-list/user-list.component';
import { AddUserComponent } from '../add-user/add-user.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    HeaderComponent,
    DockModule,
    UserListComponent,
    AddUserComponent,
  ],
  providers: [HttpService, ConfirmationService, MessageService],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent implements OnInit {
  userRegistrationForm!: FormGroup;
  items: MenuItem[] | undefined;
  isUserListing: boolean = true;
  isNewUser: boolean = false;

  constructor(private httpService: HttpService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.items = [
      {
        label: 'User List',
        icon: '../../../assets/List.png',
        command: () => {
          this.isUserListing = true;
          this.isNewUser = false;
        },
      },
      {
        label: 'Add User',
        icon: '../../../assets/Add.png',
        command: () => {
          this.isUserListing = false;
          this.isNewUser = true;
        },
      },
    ];
  }


}
