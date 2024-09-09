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
import { MenubarModule } from 'primeng/menubar';
import { PanelMenuModule } from 'primeng/panelmenu';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [SidebarModule, Button, CardModule, MenubarModule, PanelMenuModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css',
})
export class SideNavComponent implements OnInit {
  @Input() sidebarVisible: boolean = true;
  @Output() onCloseMenu = new EventEmitter<boolean>();
  username:string | null = null;

  navigationList = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      routerLink: ['/home/index'],
    },
    {
      label: 'Passwords',
      icon: 'pi pi-lock',
      routerLink: ['/home/password'],
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
            label: 'User',
            icon: 'pi pi-users',
            routerLink: ['/home/user'],
          },
          {
            label: 'Audit Logs',
            icon: 'pi pi-file',
            routerLink: ['/home/audit-log']
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
