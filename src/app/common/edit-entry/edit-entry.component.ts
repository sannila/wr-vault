import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { HttpService } from '../../services/http.service';
import { HttpClientModule } from '@angular/common/http';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessagesModule } from 'primeng/messages';
import { Router } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-edit-entry',
  standalone: true,
  imports: [
    HttpClientModule,
    InputGroupModule,
    InputGroupAddonModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
    MessagesModule,
    ToastModule,
    DropdownModule,
    FormsModule,
  ],
  providers: [HttpService, ConfirmationService, MessageService],
  templateUrl: './edit-entry.component.html',
  styleUrl: './edit-entry.component.css',
})
export class EditEntryComponent implements OnInit {
  @Input() editEntryId: number | null = null;
  @Input() showCopyAction: boolean = false;
  @Input() sidebarVisible: boolean = false;
  @Output() onEntryUpdated = new EventEmitter<boolean>();
  entryDetails = [];
  entryErrorMessage: string = '';
  rootFolderList: any[] = [];
  childFolderList: any[] = [];
  folderList: any[] = [];
  folderDDMValues: { label: any; value: any }[] = [];
  saveFolder = null;
  current_folder_value: any = null;
  isChangeFolders = false;
  urlPattern2 =
    /^(?:(http(s)?)?(sftp)?(ftp)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
  password =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

  // form
  newEntryForm!: FormGroup;

  constructor(
    private httpService: HttpService,
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initialFunctions();
  }

  initialFunctions() {
    this.current_folder_value = null;
    this.getRootFolders();
    this.getChildFolders();
    if (this.editEntryId != null) {
      this.getEntryDetails(this.editEntryId);
      return;
    }
    this.newEntryformInialization();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editEntryId'] && changes['editEntryId'].currentValue) {
      this.getEntryDetails(changes['editEntryId'].currentValue);
    }
    if (
      changes['sidebarVisible'] &&
      changes['sidebarVisible'].currentValue == false
    ) {
      this.newEntryformInialization();
      this.newEntryForm.reset();
    }
    this.initialFunctions();
  }

  get entryFormControl() {
    return this.newEntryForm.controls;
  }

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

  getEntryDetails(id: number) {
    this.httpService.get('entries/entry/' + id).subscribe(
      (data) => {
        this.entryDetails = data;
        this.newEntryformInialization();
        this.newEntryForm.patchValue(this.entryDetails);
        this.current_folder_value = this.folderDDMValues.filter(
          (item: any) => item.value == data.folder_id
        );
      },
      (error) => {
        if (error.error.statusCode == 404) {
          this.router.navigate(['sign-in']);
        }
      }
    );
  }

  checkforURL() {
    console.log('Checking for URL', this.newEntryForm.get('url')?.value);
  }

  onUpdateEntry() {
    if (this.newEntryForm.valid) {
      this.httpService
        .update(`entries/entry/${this.editEntryId}`, this.newEntryForm.value)
        .subscribe((data) => {
          if (data.statusCode === 200) {
            this.onEntryUpdated.emit(true);
            this.isChangeFolders = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Entry updated successfully',
            });
          }
        });
    }
  }

  getRootFolders() {
    this.httpService.get('folders/root_folder').subscribe(
      (data) => {
        this.rootFolderList = data;

        data.forEach((element: { folder_name: any; folder_id: any }) => {
          this.folderDDMValues.push({
            label: element.folder_name,
            value: element.folder_id,
          });
        });

        console.log('Root folder list', this.folderDDMValues);
      },
      (error) => {
        if (error.error.statusCode == 404) {
          this.router.navigate(['sign-in']);
        }
      }
    );
  }

  getChildFolders() {
    this.httpService.get('folders/child_folder').subscribe(
      (data) => {
        this.childFolderList = data;
        data.forEach((element: any) => {
          this.folderDDMValues.filter((item: any) => {
            if (item.value == element.parent_folder_id)
              this.folderDDMValues.push({
                label: item.label + ' -> ' + element.folder_name,
                value: element.folder_id,
              });
          });
        });

        console.log('Root folder list', this.folderDDMValues);
      },
      (error) => {
        if (error.error.statusCode == 404) {
          this.router.navigate(['sign-in']);
        }
      }
    );
  }

  onChangeFolder() {
    this.isChangeFolders = true;
  }

  onSaveEntry() {}
}
