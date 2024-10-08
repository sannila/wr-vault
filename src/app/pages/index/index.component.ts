import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HeaderComponent } from '../../common/header/header.component';
import { SideNavComponent } from '../../common/side-nav/side-nav.component';
import { HttpService } from '../../services/http.service';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { TreeModule } from 'primeng/tree';
import { TabViewModule } from 'primeng/tabview';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { DOCUMENT } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { ClipboardModule } from '@angular/cdk/clipboard';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { response } from 'express';
import { error } from 'console';
import { User } from '../../models/model';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [
    HeaderComponent,
    SideNavComponent,
    HttpClientModule,
    AccordionModule,
    TreeModule,
    TabViewModule,
    ButtonModule,
    DialogModule,
    InputGroupModule,
    InputGroupAddonModule,
    ReactiveFormsModule,
    TableModule,
    SelectButtonModule,
    FormsModule,
    ConfirmDialogModule,
    ToastModule,
    MessagesModule,
    ClipboardModule,
  ],
  providers: [HttpService, ConfirmationService, MessageService],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
})
export class IndexComponent implements OnInit {
  isMenuOpen: boolean = false;
  activeIndex: number | null = null;
  // vault_list: any[] = [];
  // folder_list: any[] = [];
  visibleDialog: boolean = false;
  // vaultID: number | null = null;
  // vaultDialog: boolean = false;
  entryDialog: boolean = false;
  isUpdate: boolean = false;
  updateEntryId: number | null = null;
  authDialog: boolean = false;
  authPassword: string | null = null;
  isShowPasswords: boolean = false;
  entryPassword: string | null = null;

  newVaultForm!: FormGroup;
  newFolderForm!: FormGroup;
  newEntryForm!: FormGroup;

  // for accordion
  folderIndex: number | null = null;
  parentFolderId: number | null = null;
  parentFolderList: any[] = [];
  subfolderList1: any[] = [];
  folderType: string = '';
  entrieList: any[] = [];
  subfolderEntrieList: any[] = [];
  subfolderIndex: number = 0;
  entryFolderId: number | null = null;
  entryErrorMessage: string = '';

  urlPattern2 =
    /^(?:(http(s)?)?(sftp)?(ftp)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
  password =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

  actionValue: any;
  actionOptions: any[] = [
    { icon: 'pi pi-pencil', value: 'edit' },
    { icon: 'pi pi-copy', value: 'password' },
    { icon: 'pi pi-trash', value: 'delete' },
  ];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private httpService: HttpService,
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const localStorage = this.document.defaultView?.localStorage;
    if (localStorage && localStorage.getItem('authToken') != null) {
      // this.getVaultList();
      this.getFolders();
      this.newfolderFormInialization();
      // this.newVaultformInialization();
      this.newEntryformInialization();
    } else {
      this.router.navigate(['sign-in']);
      return;
    }
  }

  // Get root folders (parent folders)
  getFolders() {
    this.httpService.get('folders/root_folder').subscribe(
      (folders) => {
        this.parentFolderList = folders;
      },
      (error) => {
        if (error.error.statusCode == 404) {
          this.router.navigate(['sign-in']);
        }
      }
    );
  }

  newfolderFormInialization() {
    this.newFolderForm = this.formBuilder.group({
      folder_name: new FormControl('', Validators.required),
      vault_id: new FormControl(null),
      parent_folder_id: new FormControl(null),
    });
  }

  // newVaultformInialization() {
  //   this.newVaultForm = this.formBuilder.group({
  //     vault_name: new FormControl('', Validators.required),
  //   });
  // }

  newEntryformInialization() {
    this.newEntryForm = this.formBuilder.group({
      entry_name: new FormControl('', Validators.required),
      url: new FormControl('', [
        Validators.required,
        Validators.pattern(this.urlPattern2),
      ]),
      username: new FormControl('', Validators.required),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(this.password),
      ]),
      notes: new FormControl(''),
      folder_id: new FormControl(null),
    });
  }

  get entryFormControl() {
    return this.newEntryForm.controls;
  }

  activeIndexChange(index: any) {
    this.activeIndex = index;
  }

  activeFolderIndexChange(index: any) {
    this.folderIndex = index;
  }

  activeSubfolderIndexChange(index: any) {
    this.subfolderIndex = index;
  }

  openMenu(event: boolean) {
    this.isMenuOpen = event;
  }

  onClose(event: boolean) {
    this.isMenuOpen = event;
  }

  checkforURL() {
    console.log('Checking for URL', this.newEntryForm.get('url')?.value);
  }

  showDialog(id: number | null, type: string) {
    console.log('folder', id);
    this.folderType = type;
    this.parentFolderId = id;
    this.newFolderForm.get('parent_folder_id')?.patchValue(id);
    this.visibleDialog = true;
  }

  onCanceldialog() {
    this.parentFolderId = null;
    this.visibleDialog = false;
    this.newFolderForm.reset();
  }

  showEntryDialog(folderID: number) {
    this.entryDialog = true;
    this.entryFolderId = folderID;
  }

  onCancelEntrydialog() {
    this.entryDialog = false;
    this.isUpdate = false;
    this.newEntryForm.reset();
    this.entryFolderId = null;
    this.entryErrorMessage = '';
    this.actionValue = null;
  }

  onCancelAuthdialog() {
    this.authDialog = false;
    this.actionValue = null;
  }

  // showVaultDialog() {
  //   this.vaultDialog = true;
  // }

  // onCancelVaultdialog() {
  //   this.vaultDialog = false;
  // }

  onAuthenticate() {
    let data: User = {
      email: localStorage.getItem('email')!,
      password: this.authPassword!,
    };
    this.httpService.post('users/login', data).subscribe(
      (data) => {
        if (data) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Authentication successful',
          });
          this.isShowPasswords = true;
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.errorMessage,
        });
      }
    );
    console.log('Auth data', data);
  }

  // onSaveVault() {
  //   let data = this.newVaultForm.value;
  //   if (this.newVaultForm.valid) {
  //     this.httpService.post('vaults/create', data).subscribe((data) => {
  //       // this.getVaultList();
  //       this.vaultDialog = false;
  //       this.messageService.add({
  //         severity: 'success',
  //         summary: 'Success',
  //         detail: 'Vault created successfully',
  //       });
  //     });
  //   }
  // }

  onSaveFolder() {
    // if (this.folderType === 'subFolder') {
    //   this.newFolderForm.get('parent_folder_id')?.patchValue(this.parentFolderId);
    //   // this.newFolderForm.get('vault_id')?.patchValue(null);
    // }
    let data = this.newFolderForm.value;
    if (this.newFolderForm.valid) {
      this.httpService.post('folders/create', data).subscribe(
        (data) => {
          // this.getParentFolderlist(this.vaultID!);
          if (this.parentFolderId) {
            this.get_parent_folder_list(this.parentFolderId);
          } else {
            this.getFolders();
          }
          // this.vaultID = null;
          this.onCanceldialog();
          this.visibleDialog = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Folder created successfully',
          });
        },
        (error) => {
          if (error && error.error.statusCode == 409) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error.message,
            });
          }
        }
      );
    }
  }

  // for accordiance

  // getParentFolderlist(vaultID: number) {
  //   this.httpService.get(`folders/folder/${vaultID}`).subscribe((response) => {
  //     this.parentFolderList = response;
  //   });
  // }

  get_parent_folder_list(folder_id: number) {
    this.httpService
      .get(`folders/parent_folder/${folder_id}`)
      .subscribe((response) => {
        this.subfolderList1 = response;
      });
  }

  get_parent_folder_entries(folder_id: number) {
    this.httpService
      .get(`entries/entries/${folder_id}`)
      .subscribe((response) => {
        this.entrieList = response;
      });
  }

  get_parentfolder_entries(folder_id: number) {
    this.get_parent_folder_list(folder_id);

    this.get_parent_folder_entries(folder_id);
  }

  get_subfolder_entries(folder_id: number) {
    this.subfolderEntrieList = [];
    this.httpService
      .get(`entries/entries/${folder_id}`)
      .subscribe((response) => {
        this.subfolderEntrieList = response;
      });
  }

  onSaveEntry() {
    if (this.newEntryForm.valid) {
      this.newEntryForm.get('folder_id')?.patchValue(this.entryFolderId);
      let data = this.newEntryForm.value;

      this.httpService.post('entries/create', data).subscribe(
        (data) => {
          if (data.statusCode === 201) {
            this.get_parent_folder_entries(this.entryFolderId!);
            this.onCancelEntrydialog();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Entry created successfully',
            });
          }
        },
        (error) => {
          console.log('error', error);
          this.entryErrorMessage = error.error.message;
        }
      );
    }
  }

  onActionClick(event: any, entrie: any): void {
    if (this.actionValue) {
      this.updateEntryId = null;
      this.entryFolderId = entrie.folder_id;
      switch (this.actionValue.value) {
        case 'edit':
          this.updateEntryId = entrie.entry_id;
          this.newEntryForm.patchValue(entrie);
          this.entryDialog = true;
          this.isUpdate = true;
          break;
        case 'password':
          this.authDialog = true;
          this.entryPassword = entrie.password;
          break;
        case 'delete':
          this.confirmDialog(event, entrie.entry_id);
          // this.deleteEntry(entrie.entry_id);
          break;
      }
    }
    return;
  }

  confirmDialog(event: any, entry_id: number) {
    this.confirmationService.confirm({
      target: event?.target as EventTarget,
      message: 'Are you sure you want to delete this entry?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteEntry(entry_id);
      },
      reject: () => {
        this.actionValue = null;
        return;
      },
    });
  }

  onUpdateEntry() {
    if (this.newEntryForm.valid) {
      this.httpService
        .update(`entries/entry/${this.updateEntryId}`, this.newEntryForm.value)
        .subscribe((data) => {
          if (data.statusCode === 200) {
            this.get_parentfolder_entries(this.entryFolderId!);
            this.onCancelEntrydialog();
            this.isUpdate = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Entry updated successfully',
            });
          }
        });
    }
  }

  deleteEntry(entrieId: number) {
    this.httpService.delete(`entries/${entrieId}`).subscribe((data) => {
      if (data.statusCode === 200) {
        this.get_parentfolder_entries(this.entryFolderId!);
        this.actionValue = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Entry deleted successfully',
        });
      }
    });
  }

  onClosePassDialog() {
    this.isShowPasswords = false;
    this.actionValue = null;
    this.authPassword = null;
    this.entryPassword = null;
  }

  onDeleteFolder(folder_id: number, parentFolderId?: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this folder?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.httpService.delete('folders/' + folder_id).subscribe(
          (data) => {
            if (parentFolderId) {
              this.get_parent_folder_list(parentFolderId!);
            } else {
              this.getFolders();
            }
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Folder deleted successfully',
            });
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: "Folder contains subfolder/entries, can't be deleted.",
            });
          }
        );
      },
      reject: () => {
        return;
      },
    });
  }
}
