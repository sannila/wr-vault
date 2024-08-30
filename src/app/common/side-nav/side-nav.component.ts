import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
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
  username = localStorage.getItem('username');

  navigationList = [
    {
      title: 'Home',
      link: 'index',
    },
    {
      title: 'User',
      link: 'user',
    }
  ]

  constructor(private router: Router, @Inject(DOCUMENT) private document: Document) {
    // const localStorage = this.document.defaultView?.localStorage;
    // if(localStorage){
    // const authToken = localStorage.getItem('authToken');}
    // if (!authToken) {
    //   this.router.navigate(['sign-in']);
    // }
  }

  ngOnInit(): void {}

  onClose() {
    this.onCloseMenu.emit(false);
  }

  onLogout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['sign-in']);
  }

  onNavigation(link: string){
    this.router.navigate([link]);
  }
}
