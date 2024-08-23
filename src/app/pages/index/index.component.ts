import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../common/header/header.component';
import { SideNavComponent } from '../../common/side-nav/side-nav.component';
import { HttpService } from '../../services/http.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [HeaderComponent, SideNavComponent, HttpClientModule],
  providers: [HttpService],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
})
export class IndexComponent implements OnInit {
  isMenuOpen: boolean = false;

  constructor(private httpSerivce: HttpService) {}

  ngOnInit(): void {
    this.getVaultList();
  }

  getVaultList() {
    this.httpSerivce.get('vaults/list').subscribe({
      next(value) {
        console.log('Vault list', value);
      },
      error(err) {
        console.log('Error', err);
      },
    });
  }

  openMenu(event: boolean) {
    this.isMenuOpen = event;
  }

  onClose(event: boolean) {
    this.isMenuOpen = event;
  }
}
