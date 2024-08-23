import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./common/header/header.component";
import { SignInComponent } from "./auth/sign-in/sign-in.component";
import { LoaderComponent } from "./common/loader/loader.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SignInComponent, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isLoading: boolean = false;
  title = 'wr-vault';

  toggleLoader() {
    this.isLoading = !this.isLoading;
  }
}
