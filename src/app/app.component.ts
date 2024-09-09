import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './common/header/header.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { LoaderComponent } from './common/loader/loader.component';
import { SideNavComponent } from './common/side-nav/side-nav.component';

import { MenubarModule } from 'primeng/menubar';
import { PanelMenuModule } from 'primeng/panelmenu';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    SignInComponent,
    LoaderComponent,
    SideNavComponent,
    MenubarModule,
    PanelMenuModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  isLoading: boolean = false;
  title = 'wr-vault';

  //
  showNav = false;

  constructor(private router: Router) {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.showNav = event.url !== '/sign-in';
      }
    });
  }

  toggleLoader() {
    this.isLoading = !this.isLoading;
  }
}
