import { Component } from '@angular/core';

@Component({
  selector: 'app-test-button',
  standalone: true,
  imports: [],
  templateUrl: './test-button.component.html',
  styleUrl: './test-button.component.scss'
})
export class TestButtonComponent {
  onButtonClick() {
    alert('Botão clicado!');
  }
}
