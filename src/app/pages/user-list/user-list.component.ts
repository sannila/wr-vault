import { Component, OnInit } from '@angular/core';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { HttpService } from '../../services/http.service';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { User } from '../../models/model';
import { SelectButtonModule } from 'primeng/selectbutton';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { AddUserComponent } from '../add-user/add-user.component';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    InputGroupModule,
    InputGroupAddonModule,
    TableModule,
    SelectButtonModule,
    FormsModule,
    DialogModule,
    AddUserComponent,
    ReactiveFormsModule,
    ButtonModule,
    ToastModule,
    CardModule,
    ConfirmDialogModule
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit {
  userList: User[] = [];
  actionValue: any;
  actionOptions: any[] = [
    { icon: 'pi pi-pencil', value: 'edit' },
    { icon: 'pi pi-key', value: 'password' },
    { icon: 'pi pi-trash', value: 'delete' },
  ];
  editActionDialog: boolean = false;
  isDeleteAction: boolean = false;
  isPasswordDialog: boolean = false;
  userID: number | null = null;

  passwordForm!: FormGroup;

  constructor(
    private httpSerivce: HttpService,
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.getUserList();
    this.passwordFormIntialization();
  }

  passwordFormIntialization() {
    this.passwordForm = this.fb.group({
      password: new FormControl('', Validators.required),
    });
  }

  get passwordFormControl() {
    return this.passwordForm.controls;
  }

  getUserList() {
    this.httpSerivce.get('users/list').subscribe(
      (data) => {
        this.userList = data;
        console.log('userList', this.userList);
      },
      (error) => {
        if (error.error.statusCode == 404) {
          this.router.navigate(['sign-in']);
        }
      }
    );
  }

  onEdit(user_id: number){
    this.userID = user_id;
    this.editActionDialog = true;
  }

  onPasswordChange(user_id: number){
    this.userID = user_id;
    this.isPasswordDialog = true;
  }


  onUserDelete(user_id: number){
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this user?',
      accept: () => {
        this.httpSerivce.delete('users/user/' + user_id).subscribe(
          (data) => {
            this.getUserList();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'User deleted successfully',
            });
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error.errorMessage,
            });
          }
        );
      },
    });
  }


  onCloseDialog() {
    this.editActionDialog = false;
    this.userID = null;
    this.actionValue = null;
  }

  onUpdatePassword() {
    var data = this.passwordForm.value;
    this.httpSerivce.update('user/password/' + this.userID, data).subscribe(
      (data) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Password updated successfully',
        });
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.errorMessage,
        });
      }
    );
  }
}
