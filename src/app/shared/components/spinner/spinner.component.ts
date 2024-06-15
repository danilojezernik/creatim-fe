import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { spinnerText } from "../../global_variables/global.const";

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner.component.html'
})
export class SpinnerComponent {

  protected readonly spinnerText = spinnerText
}
