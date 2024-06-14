import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { People } from "../../../models/people";
import { buttonText } from "../../global_variables/global.const";

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
  @Input() jedi!: People;

  /**
   * Input property to receive the index of the current Jedi in the list.
   * Used to identify which Jedi is being interacted with.
   */
  @Input() index!: number;

  /**
   * Input property to receive the list of fields that can be edited.
   * Each field specifies the label, model property, and suffix (if any).
   */
  @Input() editFields!: any[];

  /**
   * Input property to determine if the current Jedi is in edit mode.
   * If true, the card shows input fields for editing the Jedi details.
   */
  @Input() editMode!: boolean;

  /**
   * Output event emitter to notify when the edit mode should be toggled.
   * Emits the index of the current Jedi to the parent component.
   */
  @Output() toggleEdit = new EventEmitter<number>();

  /**
   * Output event emitter to notify when the edited details should be saved.
   * Emits the index of the current Jedi to the parent component.
   */
  @Output() saveEdit = new EventEmitter<number>();

  /**
   * Output event emitter to notify when the editing should be canceled.
   * Emits the index of the current Jedi to the parent component.
   */
  @Output() cancelEdit = new EventEmitter<number>();

  /**
   * Method to toggle the edit mode of the current Jedi.
   * Emits the toggleEdit event with the index of the current Jedi.
   */
  toggleEditMode() {
    this.toggleEdit.emit(this.index);
  }

  /**
   * Method to save the edited details of the current Jedi.
   * Emits the saveEdit event with the index of the current Jedi.
   */
  saveEdited() {
    this.saveEdit.emit(this.index);
  }

  /**
   * Method to cancel the editing of the current Jedi.
   * Emits the cancelEdit event with the index of the current Jedi.
   */
  cancelEdited() {
    this.cancelEdit.emit(this.index);
  }

  protected readonly buttonText = buttonText;
}
