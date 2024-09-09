import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../common/header/header.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { HttpService } from '../../services/http.service';
import { HttpClientModule } from '@angular/common/http';
import { SidebarModule } from 'primeng/sidebar';
import { EditEntryComponent } from '../../common/edit-entry/edit-entry.component';
import { Router } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-passwords',
  standalone: true,
  imports: [
    HeaderComponent,
    TableModule,
    ButtonModule,
    HttpClientModule,
    SidebarModule,
    EditEntryComponent,
    ConfirmDialogModule,
    ToastModule,
  ],
  providers: [HttpService, MessageService, ConfirmationService],
  templateUrl: './passwords.component.html',
  styleUrl: './passwords.component.css',
})
export class PasswordsComponent implements OnInit {
  entryList: any[] = [];
  sidebarVisible: boolean = false;
  editEntryId: number | null = null;
  showCopyAction: boolean = false;

  constructor(
    private httpService: HttpService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.getEntryDetails();
  }

  getEntryDetails() {
    this.httpService.get('entries/entry').subscribe(
      (data) => {
        this.entryList = data;
      },
      (error) => {
        if (error.error.statusCode == 404) {
          this.router.navigate(['sign-in']);
        }
      }
    );
  }

  getAvatarName(entry_name: string): string {
    // return the 1st character of the parameter
    return entry_name.charAt(0).toUpperCase();
  }

  onEditEntry(entryId: number) {
    this.sidebarVisible = true;
    this.editEntryId = entryId;
    this.showCopyAction = true;
  }

  onEntryUpdated(event: boolean) {
    if (event) {
      this.getEntryDetails();
      this.sidebarVisible = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Entry updated successfully',
      });
    }
  }

  onShareEntry() {
    console.log('onShareEntry');
  }

  onDeleteEntry(entry_id: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this entry?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteEntry(entry_id);
      },
    });
  }

  deleteEntry(entry_id: number) {
    this.httpService.delete(`entries/${entry_id}`).subscribe((data) => {
      if (data.statusCode === 200) {
        this.getEntryDetails();
      }
    });
  }

  onAddNewEntry(){
    this.sidebarVisible = true;
    this.editEntryId = null;
    this.showCopyAction = false;
  }

  onClosingSidenav(){
    this.sidebarVisible = false;
  }
}
