import { Component, Inject, OnInit } from '@angular/core';
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

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { response } from 'express';

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
  ],
  providers: [HttpService],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
})
export class IndexComponent implements OnInit {
  isMenuOpen: boolean = false;
  activeIndex: number | null = null;
  vault_list: any[] = [];
  // folder_list: any[] = [];
  visibleDialog: boolean = false;
  vaultID: number | null = null;
  vaultDialog: boolean = false;
  entryDialog: boolean = false;

  newVaultForm!: FormGroup;
  newFolderForm!: FormGroup;
  newEntryForm!: FormGroup;

  // for accordion
  folderIndex: number = 0;
  parentFolderList: any[] = [];
  subfolderList1: any[] = [];
  folderType: string = '';
  entrieList: any[] = [];
  subfolderEntrieList: any[] = [];
  subfolderIndex: number = 0;
  entryFolderId: number | null = null;
  entryErrorMessage: string = '';

  urlPattern2 = /^(?:(http(s)?)?(sftp)?(ftp)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
  password = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;


  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private httpService: HttpService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    const localStorage = this.document.defaultView?.localStorage;
    if (localStorage && localStorage.getItem('authToken') != null) {
      this.getVaultList();
      this.newfolderFormInialization();
      this.newVaultformInialization();
      this.newEntryformInialization();
    } else {
      this.router.navigate(['sign-in']);
      return;
    }
  }

  newfolderFormInialization() {
    this.newFolderForm = this.formBuilder.group({
      folder_name: new FormControl('', Validators.required),
      vault_id: new FormControl(null),
      parent_folder_id: new FormControl(null),
    });
  }

  newVaultformInialization() {
    this.newVaultForm = this.formBuilder.group({
      vault_name: new FormControl('', Validators.required),
    });
  }

  newEntryformInialization() {
    this.newEntryForm = this.formBuilder.group({
      entry_name: new FormControl('', Validators.required),
      url: new FormControl('', [Validators.required, Validators.pattern(this.urlPattern2)]),
      username: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.pattern(this.password)]),
      notes: new FormControl(''),
      folder_id: new FormControl(null),
    });
  }

  get entryFormControl(){
    return this.newEntryForm.controls;
  }

  getVaultList() {
    this.httpService.get('vaults/list').subscribe(
      (response) => {
        this.vault_list = response;
      },
      (error) => {
        if (error.error.statusCode == 404) {
          this.router.navigate(['sign-in']);
        }
      }
    );
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

  checkforURL(){
    console.log("Checking for URL", this.newEntryForm.get('url')?.value);
  }

  // getFolderlist(vaultID: any) {
  //   console.log('getFolderlist', vaultID);
  //   this.httpService.get(`folders/folder/${vaultID}`).subscribe((response) => {
  //     console.log('getFolderlist', response);
  //     this.folder_list = this.createTreeNodesData(response);
  //     this.getEntries(this.folder_list);
  //   });
  // }

  // getEntries(folderList: any[]) {
  //   folderList.forEach((folder) => {
  //     this.httpService
  //       .get(`entries/entry/${folder.key}`)
  //       .subscribe((entries) => {
  //         if (entries && entries.length > 0) {
  //           entries.forEach((entry: any) => {
  //             folder.children.push({
  //               key: folder.key + '-' + entry.entry_id,
  //               label: entry.entry_name,
  //               data: `${entry.entry_name} with url`,
  //               icon: 'pi pi-address-book',
  //             });
  //           });
  //         }
  //       });
  //   });

  //   console.log('getEntries', this.folder_list);
  // }

  // createTreeNodesData(data: any[]) {
  //   let treeNodes: {
  //     key: any;
  //     label: any;
  //     data: any;
  //     icon: string;
  //     children: never[];
  //   }[] = [];
  //   data.forEach((item) => {
  //     let node = {
  //       key: item.folder_id,
  //       label: item.folder_name,
  //       data: item.folder_name,
  //       icon: 'pi pi-folder-open',
  //       children: [],
  //     };
  //     treeNodes.push(node);
  //   });
  //   console.log('createTreeNodesData', treeNodes);

  //   return treeNodes;
  // }

  showDialog(id: number, type: string) {
    console.log('vaultID', id);
    this.folderType = type;
    this.vaultID = id;
    this.newFolderForm.get('vault_id')?.patchValue(id);
    this.visibleDialog = true;
  }

  onCanceldialog() {
    this.vaultID = null;
    this.visibleDialog = false;
  }

  showEntryDialog(folderID: number) {
    this.entryDialog = true;
    this.entryFolderId = folderID;
  }

  onCancelEntrydialog() {
    this.entryDialog = false;
    this.newEntryForm.reset();
    this.entryFolderId = null;
    this.entryErrorMessage = '';
  }

  onSaveFolder() {
    if (this.folderType === 'subFolder') {
      this.newFolderForm.get('parent_folder_id')?.patchValue(this.vaultID);
      this.newFolderForm.get('vault_id')?.patchValue(null);
    }
    let data = this.newFolderForm.value;
    if (this.newFolderForm.valid) {
      this.httpService.post('folders/create', data).subscribe((data) => {
        // this.getFolderlist(this.vaultID);
        this.vaultID = null;
        this.visibleDialog = false;
      });
    }
  }

  showVaultDialog() {
    this.vaultDialog = true;
  }

  onCancelVaultdialog() {
    this.vaultDialog = false;
  }

  onSaveVault() {
    let data = this.newVaultForm.value;
    if (this.newVaultForm.valid) {
      this.httpService.post('vaults/create', data).subscribe((data) => {
        this.getVaultList();
        this.vaultDialog = false;
      });
    }
  }

  // for accordiance

  getParentFolderlist(vaultID: number) {
    this.httpService.get(`folders/folder/${vaultID}`).subscribe((response) => {
      this.parentFolderList = response;
    });
  }

  get_parentfolder_entries(folder_id: number) {
    this.httpService
      .get(`folders/parent_folder/${folder_id}`)
      .subscribe((response) => {
        this.subfolderList1 = response;
      });

    this.httpService.get(`entries/entry/${folder_id}`).subscribe((response) => {
      this.entrieList = response;
    });
  }

  get_subfolder_entries(folder_id: number) {
    this.httpService.get(`entries/entry/${folder_id}`).subscribe((response) => {
      this.subfolderEntrieList = response;
    });
  }

  onSaveEntry() {
    if (this.newEntryForm.valid) {
      this.newEntryForm.get('folder_id')?.patchValue(this.entryFolderId);
      let data = this.newEntryForm.value;

      this.httpService.post('entries/create', data).subscribe((data) => {
        if (data.statusCode === 201) {
          this.get_parentfolder_entries(this.entryFolderId!);
          this.onCancelEntrydialog();
        }
      }, error => {
        console.log('error', error);
        this.entryErrorMessage = error.error.message;
      });
    }
  }
}
