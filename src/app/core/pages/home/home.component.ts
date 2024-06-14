import { Component, inject, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SwapiService } from "../../../services/api/swapi.service"
import { catchError, forkJoin, map, Observable, of, tap } from "rxjs"
import { SpinnerComponent } from "../../../shared/spinner/spinner/spinner.component"
import { People } from "../../../models/people"
import { desiredNames, editFields, noDataDarthVader } from "../../../shared/global_variables/global.const"
import { SoundPlayerService } from "../../../services/sound-player/sound-player.service"
import { FormsModule } from "@angular/forms"
import { animate, state, style, transition, trigger } from "@angular/animations";

/**
 * HomeComponent represents the main component of the application.
 * It fetches and displays data related to Jedi characters, allowing
 * users to edit their details and handles data loading and error states.
 */

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ CommonModule, SpinnerComponent, FormsModule ],
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

  /** Observable to hold data for Yoda, Darth Vader, and Obi-Wan Kenobi */
  peopleAllThree$!: Observable<People[]>

  /** Array to store the current edited version of People data */
  savedPeople: People[] = []

  /** Array to store the original People data fetched from API or localStorage */
  originalPeople: People[] = []

  /** Path to the image file for displaying when no data is available for Darth Vader */
  protected readonly noDataDarthVader = noDataDarthVader

  /** Array defining editable fields for Jedi details */
  protected readonly editFields = editFields

  /** Error message to display if any error occurs during data fetching */
  errorMessage: string | undefined

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
    this.spinner = true;

    /**
     * Observable to fetch saved people data from local storage.
     * Uses 'of' to create an observable from the saved people data in local storage,
     * or an empty array if no data is found.
     */
    const savedPeopleFromLocalStorage$ = of(JSON.parse(localStorage.getItem('savedPeople') || '[]'));

    /**
     * Create an array of observables, each fetching data for a specific Jedi name.
     * If an error occurs while fetching data for a specific name, it logs the error and returns an empty array.
     */
    const observables = desiredNames.map(name =>
      this._peopleService.getAllDataForPeople(name).pipe(
        catchError(error => {
          console.error('Error fetching data for:', name, error.message);
          return of([] as People[]); // Return empty array in case of error
        })
      )
    );

    /**
     * Combine the observable fetching data from local storage with the observables fetching data from the SWAPI API.
     * This ensures that data is fetched from both sources.
     */
    const combinedObservables = [ savedPeopleFromLocalStorage$, ...observables ];

    /**
     * Use forkJoin to combine the results from all observables.
     * Map the results to merge unique data from both local storage and API responses.
     */
    this.peopleAllThree$ = forkJoin(combinedObservables).pipe(
      map(results => {

        // Extract data from local storage
        const localStorageData = results[0] as People[];
        console.log('Local storage data: ', localStorageData);

        // Extract data from API responses
        const apiData = results.slice(1).flat() as People[];
        console.log('API data: ', apiData);

        // Create an array to store unique people data, starting with local storage data
        const uniquePeople = [ ...localStorageData ];
        console.log('Unique data: ', uniquePeople);

        /**
         * Iterate over API data and check if each person is already in the uniquePeople array.
         * If not, add them to ensure uniqueness based on name.
         */
        apiData.forEach(person => {
          if (!uniquePeople.some(p => p.name === person.name)) {
            uniquePeople.push(person);
          }
        });

        console.log('Unique data 2: ', uniquePeople);
        return uniquePeople;
      }),
      tap((people) => {

        // Update component state after data is fetched successfully
        this.spinner = false; // Hide loading spinner
        this.savedPeople = people; // Update savedPeople array
        this.originalPeople = people.map(person => ({ ...person })); // Store a copy of original data
        localStorage.setItem('savedPeople', JSON.stringify(people)); // Save data to local storage

        console.log('this.people: ', this.savedPeople);
        console.log('this original people: ', this.originalPeople);

        // Play a sound if no data is fetched
        if (people.length === 0) {
          this._soundPlayer.playSound();
        }
      }),
      catchError(error => {
        // Handle errors during data fetching
        console.error('Error: ', error);
        this.spinner = false; // Hide loading spinner
        this.errorMessage = ''; // Clear error message
        return of([] as People[]); // Return an empty array in case of error
      })
    );
  }


  getRotationState(index: number): string {
    return this.editModes[index] ? 'rotated' : 'default';
  }

  /**
   * Method to toggle edit mode for a specific Jedi card based on index.
   * @param index The index of the Jedi card to toggle edit mode.
   */
  toggleEditMode(index: number) {
    this.editModes[index] = !this.editModes[index] // Toggle edit mode
    this.originalPeople[index] = { ...this.savedPeople[index] } // Save original data
    console.log('original people toggle: ', this.originalPeople[index])
  }

  /**
   * Method to save edited data for a specific Jedi card based on index.
   * @param index The index of the Jedi card being edited.
   */
  saveEdited(index: number) {
    this.editModes[index] = false // Exit edit mode
    this.savedPeople[index] = { ...this.savedPeople[index] } // Save edited data

    console.log('This saved people index saveEdit: ', this.savedPeople[index])
    // Update localStorage with savedPeople data
    localStorage.setItem('savedPeople', JSON.stringify(this.savedPeople))
  }

  /**
   * Method to cancel edit mode and revert changes for a specific Jedi card based on index.
   * @param index The index of the Jedi card being edited.
   */
  cancelEdit(index: number) {
    this.editModes[index] = false // Exit edit mode
    this.savedPeople[index] = { ...this.originalPeople[index] } // Revert changes
    console.log('This saved people index cancelEdit: ', this.savedPeople[index])

    // Update localStorage with reverted changes
    localStorage.setItem('savedPeople', JSON.stringify(this.savedPeople))
  }
}
