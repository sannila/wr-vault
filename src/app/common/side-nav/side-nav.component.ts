import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { Button, ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [SidebarModule, Button],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css',
})
export class SideNavComponent implements OnInit {
  @Input() sidebarVisible: boolean = false;
  @Output() onCloseMenu = new EventEmitter<boolean>();

  constructor(private router: Router) {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      this.router.navigate(['sign-in']);
    }
  }

  ngOnInit(): void {}

  onClose() {
    this.onCloseMenu.emit(false);
  }

  onLogout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['sign-in']);
  }
}
