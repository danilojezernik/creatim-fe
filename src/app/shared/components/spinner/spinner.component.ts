import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { spinnerText } from "../../global_variables/global.const";

/**
 * SpinnerComponent represents a loading spinner UI element.
 *
 * This component is used to display a loading spinner with a customizable text message,
 * indicating that a process is ongoing, such as data loading or processing.
 *
 * The main functionalities included are:
 *
 * - Displays a loading spinner with a text message and an SVG element.
 * - Uses predefined text values from the global constants.
 */

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner.component.html'
})
export class SpinnerComponent {

  protected readonly spinnerText = spinnerText
}
