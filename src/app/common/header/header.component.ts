import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Button, ButtonModule } from 'primeng/button';
import { SideNavComponent } from '../side-nav/side-nav.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [Button, SideNavComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  isMenuOpen: boolean = false;

  openMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  onClose(event: boolean) {
    this.isMenuOpen = event;
  }
}
