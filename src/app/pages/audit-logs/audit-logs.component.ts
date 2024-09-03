import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../common/header/header.component';
import { TableModule } from 'primeng/table';
import { HttpService } from '../../services/http.service';
import { HttpClientModule } from '@angular/common/http';
import { error } from 'console';
import { Router } from '@angular/router';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [HeaderComponent, TableModule, HttpClientModule],
  providers: [HttpService],
  templateUrl: './audit-logs.component.html',
  styleUrl: './audit-logs.component.css',
})
export class AuditLogsComponent implements OnInit {
  auditLogs: any[] = [];

  constructor(private httpService: HttpService, private router: Router) {}

  ngOnInit(): void {
    this.getAuditLog();
  }

  getAuditLog() {
    this.httpService.get('audit-logs').subscribe((logs) => {
      this.auditLogs = logs;
    }, error => {
      if (error.error.statusCode == 404) {
        this.router.navigate(['sign-in']);
      }
    });
  }

  getDateTimeFormated(date: Date): string {
    return new Date(date).toLocaleDateString() + ' ' + new Date(date).toLocaleTimeString();
  }
}
