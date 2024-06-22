import { Component, inject, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SwapiService } from "../../../services/api/swapi.service"
import { catchError, map, Observable, of, tap } from "rxjs"
import { SpinnerComponent } from "../../../shared/components/spinner/spinner.component"
import { Person } from "../../../models/person"
import { desiredNames, howlPerson, noDataDarthVader } from "../../../shared/global_variables/global.const"
import { SoundPlayerService } from "../../../services/sound-player/sound-player.service"
import { FormsModule } from "@angular/forms"
import { animate, state, style, transition, trigger } from "@angular/animations"
import { LocalStorageService } from "../../../services/local-storage/local-storage.service"
import { CardComponent } from "../../../shared/components/card/card.component"

/**
 * HomeComponent represents the main component of the application.
 * It fetches and displays data related to Jedi characters, allowing users
 * to edit their details, and handles data loading and error states.
 *
 * This component includes the following functionalities:
 *
 * - `ngOnInit()`: Initializes the component and fetches desired Jedi data on load.
 * - `getDesiredJedies()`: Fetches data for predefined Jedi names, manages loading state, errors, and local storage operations.
 * - `getRotationState(index: number)`: Determines the rotation state of a card based on its edit mode for CSS animations.
 * - `toggleEditMode(index: number)`: Toggles the edit mode for a specific Jedi card.
 * - `saveEdited(index: number)`: Saves the edited data for a specific Jedi card and updates local storage.
 * - `cancelEdit(index: number)`: Cancels the edit mode and reverts changes for a specific Jedi card.
 */

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ CommonModule, SpinnerComponent, FormsModule, CardComponent ],
  templateUrl: './home.component.html',
  animations: [
    trigger('rotate', [
      state('default', style({ transform: 'rotateY(0deg)' })),
      state('rotated', style({ transform: 'rotateY(180deg)' })),
      transition('default <=> rotated', [
        animate('0.5s')
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {

  /** Inject SwapiService instance for fetching data from SWAPI API */
  private _peopleService = inject(SwapiService)

  /** Inject SoundPlayerService instance for playing sound effects */
  private _soundPlayer = inject(SoundPlayerService)

  /** Injects an instance of LocalStorageService for handling local storage operations. */
  private _localStorageService = inject(LocalStorageService)

  /** Observable to hold data for Yoda, Darth Vader, and Obi-Wan Kenobi */
  peopleAllThree$!: Observable<Person[]>

  /** Array to store the current edited version of People data */
  savedPeople: Person[] = []

  /** Array to store the original People data fetched from API or localStorage */
  originalPeople: Person[] = []

  /** Path to the image file for displaying when no data is available for Darth Vader */
  protected readonly noDataDarthVader = noDataDarthVader

  /** Error message to display if any error occurs during data fetching */
  errorMessage!: boolean

  /** Array to track the edit mode status for each Jedi card */
  editModes: boolean[] = [ false, false, false ]

  /** Boolean variable to control the display of the loading spinner */
  spinner: boolean = false

  /** OnInit lifecycle hook to initialize the component */
  ngOnInit() {
    // Fetch desired Jedi data when component initializes
    this.getDesiredJedies()
  }

  /**
   * Method to fetch data for predefined Jedi names.
   * Handles loading state, errors, and local storage operations.
   */
  getDesiredJedies() {
    // Set spinner to true to show loading spinner while fetching data
    this.spinner = true

    /**
     * Use forkJoin to combine the results from all observables.
     * Map the results to merge unique data from both local storage and API responses.
     */
    this.peopleAllThree$ = this._peopleService.getPeopleByName(desiredNames).pipe(
      map(results => {

        // Retrieve data from local storage
        const localStorageData = this._localStorageService.getSavedPeople()

        // Create a unique list of people combining local storage and API results
        const uniquePeople = [ ...localStorageData ]

        // Add API results to the list if they are not already present
        results.forEach(person => {
          if (!uniquePeople.some(p => p.name === person.name)) {
            uniquePeople.push(person)
          }
        })

        return uniquePeople
      }),
      tap((people) => {

        // Update component state after data is fetched successfully
        this.spinner = false // Hide loading spinner
        this.savedPeople = people // Update savedPeople array
        this.originalPeople = people.map(person => ({ ...person })) // Store a copy of original data
        this._localStorageService.setSavedPeople(people) // Save data to local storage

        // Play a sound if no data is fetched
        if (people.length === 0) {
          this._soundPlayer.playSoundNoData()
        }

      }),
      catchError(error => {
        // Handle errors during data fetching
        console.error('Error: ', error)
        this.spinner = false // Hide loading spinner
        this.errorMessage = false // Clear error message
        return of([] as Person[]) // Return an empty array in case of error
      })
    )
  }

  /**
   * Determines the rotation state of a card based on its edit mode.
   * If the card is in edit mode, it returns 'rotated', otherwise 'default'.
   * This method is used to control the CSS class for card rotation animations.
   *
   * @param index - The index of the card in the array.
   * @returns The rotation state as a string, either 'rotated' or 'default'.
   */
  getRotationState(index: number): string {
    return this.editModes[index] ? 'rotated' : 'default'
  }

  /**
   * Method to toggle edit mode for a specific Jedi card based on index.
   * @param index The index of the Jedi card to toggle edit mode.
   */
  toggleEditMode(index: number) {
    this.editModes[index] = !this.editModes[index] // Toggle edit mode
    this.originalPeople[index] = { ...this.savedPeople[index] } // Save original data
  }

  /**
   * Method to save edited data for a specific Jedi card based on index.
   * @param index The index of the Jedi card being edited.
   */
  saveEdited(index: number) {
    this.editModes[index] = false // Exit edit mode

    // Save edited data
    const editedPerson = { ...this.savedPeople[index] }

    // Update localStorage with savedPeople data
    this._localStorageService.updatePerson(index, editedPerson)

    // Create a map of sounds to be played based on the Jedi character
    const soundMap: any = {
      [howlPerson.DARTH_VADER]: () => this._soundPlayer.playSoundNameChangeDarthVader(),
      [howlPerson.YODA]: () => this._soundPlayer.playSoundNameChangeYoda(),
      [howlPerson.OBI_WAN_KENOBI]: () => this._soundPlayer.playSoundNameChangeObiWanKenobi()
    }

    // Check if the name has changed and play the corresponding sound
    if (editedPerson.name !== this.originalPeople[index].name) {
      const playSound = soundMap[editedPerson.id]
      if (playSound) {
        playSound()
      }
    }

  }

  /**
   * Method to cancel edit mode and revert changes for a specific Jedi card based on index.
   * @param index The index of the Jedi card being edited.
   */
  cancelEdit(index: number) {
    this.editModes[index] = false // Exit edit mode
  }
}
