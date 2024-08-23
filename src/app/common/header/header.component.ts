import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Button, ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [Button],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  @Input() isMenuOpen: boolean = false;
  @Output() menuClick = new EventEmitter();


  openMenu(){
    this.isMenuOpen = !this.isMenuOpen
    this.menuClick.emit(this.isMenuOpen);
  }
}
