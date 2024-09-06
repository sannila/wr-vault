import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { Button, ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { CommonModule, DOCUMENT } from '@angular/common';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [SidebarModule, Button, CardModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css',
})
export class SideNavComponent implements OnInit {
  @Input() sidebarVisible: boolean = false;
  @Output() onCloseMenu = new EventEmitter<boolean>();
  username:string | null = null;

  navigationList = [
    {
      title: 'Home',
      link: 'index',
    },
    {
      title: 'Passwords',
      link: 'password',
    }
  ];

  constructor(
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {
    const localStorage = this.document.defaultView?.localStorage;
    if (localStorage) {
      const authToken = localStorage.getItem('authToken');
      this.username = localStorage.getItem('username');
      if(localStorage.getItem('role') === 'admin' || localStorage.getItem('role') === 'superadmin') {
        this.navigationList.push(
          {
            title: 'User',
            link: 'user',
          },
          {
            title: 'Audit Logs',
            link: 'audit-log'
          }
        )
      }
      if (!authToken) {
        this.router.navigate(['sign-in']);
        return;
      }
      return;
    }
    this.router.navigate(['sign-in']);
  }

  ngOnInit(): void {}

  onClose() {
    this.onCloseMenu.emit(false);
  }

  onLogout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['sign-in']);
  }

  onNavigation(link: string) {
    this.router.navigate([link]);
  }
}
