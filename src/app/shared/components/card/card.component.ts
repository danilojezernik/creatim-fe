import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { Person } from "../../../models/person";
import { buttonText, editFields } from "../../global_variables/global.const";

/**
 * CardComponent represents a card UI element for displaying and editing Jedi details.
 *
 * This component allows displaying a Jedi's details and provides an interface to edit the details.
 * It handles toggling the edit mode, saving edits, and canceling edits. The component uses input
 * properties to receive data and output events to communicate actions to the parent component.
 *
 * The main functionalities included are:
 *
 * - `toggleEditMode()`: Toggles the edit mode for the current Jedi and emits an event to the parent component.
 * - `saveEdited()`: Saves the edited details of the current Jedi and emits an event to the parent component.
 * - `cancelEdited()`: Cancels the editing of the current Jedi and emits an event to the parent component.
 */

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './card.component.html'
})
export class CardComponent {

  /**
   * Input property to receive a Jedi object.
   * This object contains the details of the Jedi to be displayed or edited.
   */
  @Input() jedi!: Person;

  /**
   * Input property to receive the list of fields that can be edited.
   * Each field specifies the label, model property, and suffix (if any).
   */
  editFields = editFields;

  /**
   * Input property to determine if the current Jedi is in edit mode.
   * If true, the card shows input fields for editing the Jedi details.
   */
  @Input() editMode!: boolean;

  /**
   * Output event emitter to notify when the edit mode should be toggled.
   * Emits the event to the parent component without any specific index.
   */
  @Output() toggleEdit = new EventEmitter<void>();

  /**
   * Output event emitter to notify when the edited details should be saved.
   * Emits the event to the parent component without any specific index.
   */
  @Output() saveEdit = new EventEmitter<void>();

  /**
   * Output event emitter to notify when the editing should be canceled.
   * Emits the event to the parent component without any specific index.
   */
  @Output() cancelEdit = new EventEmitter<void>();

  /**
   * Method to toggle the edit mode of the current Jedi.
   * Emits the toggleEdit event to the parent component.
   */
  toggleEditMode() {
    this.toggleEdit.emit();
  }

  /**
   * Method to save the edited details of the current Jedi.
   * Emits the saveEdit event to the parent component.
   */
  saveEdited() {
    this.saveEdit.emit();
  }

  /**
   * Method to cancel the editing of the current Jedi.
   * Emits the cancelEdit event to the parent component.
   */
  cancelEdited() {
    this.cancelEdit.emit();
  }

  /**
   * Text for buttons used in the component.
   * Uses predefined text values from the global constants.
   */
  protected readonly buttonText = buttonText;
}
