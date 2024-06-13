import { Component, inject, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SwapiService } from "../../../services/api/swapi.service"
import { catchError, forkJoin, map, Observable, of, tap } from "rxjs"
import { SpinnerComponent } from "../../../shared/spinner/spinner/spinner.component"
import { People } from "../../../models/people"
import { desiredNames, noDataDarthVader } from "../../../shared/global_variables/global.const"
import { SoundPlayerService } from "../../../services/sound-player/sound-player.service";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ CommonModule, SpinnerComponent, FormsModule ],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  /**
   * Inject SwapiService to access methods for fetching Star Wars API data
   */
  private _peopleService = inject(SwapiService);

  /**
   * Inject SoundPlayerService to access methods for playing sounds
   */
  private _soundPlayer = inject(SoundPlayerService);

  /**
   * Observable that will emit an array of People objects for Yoda, Darth Vader, and Obi-Wan Kenobi
   */
  peopleAllThree$!: Observable<People[]>;

  /**
   * Arrays to hold the saved and original people data
   */
  savedPeople: People[] = [];
  originalPeople: People[] = [];

  localStorageOriginal: any
  localStorageSave: any
  /**
   * Variable to hold error messages if any occur during data fetching
   */
  errorMessage: string | undefined;

  /**
   * Array to track edit modes for each Jedi card
   */
  editModes: boolean[] = [];

  /**
   * Boolean variable to control the display of a loading spinner
   */
  spinner: boolean = false;

  /**
   * OnInit lifecycle hook to initialize the component.
   * Fetches data and subscribes to the people observable to initialize editModes array
   */
  ngOnInit() {
    this.getDesiredJedies();

    /**
     * Subscribe to the people observable to initialize data and edit modes
     */
    this.peopleAllThree$.subscribe(people => {

      this.editModes = new Array(people.length).fill(false); // Initialize editModes array
      this.savedPeople = [...people]; // Clone fetched data to savedPeople
      this.originalPeople = people.map(person => ({ ...person })); // Clone fetched data to originalPeople

    });
  }

  /**
   * Method to toggle edit mode for a specific Jedi card based on index
   * @param index The index of the Jedi card to toggle edit mode
   */
  toggleEditMode(index: number) {
    this.editModes[index] = !this.editModes[index]; // Toggle edit mode for the specific Jedi card
    /**
     * Clone the current state of the savedPeople data for the specific index
     */
    this.originalPeople[index] = { ...this.savedPeople[index] };
  }

  /**
   * Fetches data for the specified names and handles loading state and errors
   */
  getDesiredJedies() {
    this.spinner = true; // Show the spinner while loading data

    /**
     * Create an array of observables, each fetching data for one name using SwapiService
     */
    const observables = desiredNames.map(name =>
      this._peopleService.getAllDataForPeople(name).pipe(
        /**
         * Handle errors for each observable, log the error, and return an empty array
         */
        catchError(error => {
          console.error('Error fetching data for:', name, error.message);
          return of([] as People[]);
        })
      )
    );

    /**
     * Combine the results of all observables into one observable using forkJoin
     */
    this.peopleAllThree$ = forkJoin(observables).pipe(
      /**
       * Flatten the array of arrays into a single array
       */
      map(results => results.flat()),

      /**
       * Hide the spinner once data is loaded
       */
      tap((people) => {
        this.spinner = false;
        this.savedPeople = people; // Update savedPeople with loaded data

        this.originalPeople = people.map(person => ({ ...person })); // Update originalPeople with loaded data
      }),

      /**
       * Play a sound if no data is loaded
       */
      tap((people) => {
        if (people.length === 0) {
          this._soundPlayer.playSound();
        }
      }),

      /**
       * Handle any errors during the combining process
       */
      catchError(error => {
        console.error('Error: ', error);
        this.spinner = false;
        this.errorMessage = 'Failed to load data';
        return of([] as People[]);
      })
    );
  }

  /**
   * Save the edited data for a specific index
   * @param index The index of the Jedi card being edited
   */
  saveEdited(index: number) {
    this.editModes[index] = false; // Exit edit mode for the specific Jedi card
    this.savedPeople[index] = { ...this.savedPeople[index] }

    // Update localStorage with savedPeople
    localStorage.setItem('savedPeople', JSON.stringify(this.savedPeople));
  }

  /**
   * Cancel the edit mode and revert changes for a specific index
   * @param index The index of the Jedi card being edited
   */
  cancelEdit(index: number) {
    this.editModes[index] = false; // Exit edit mode for the specific Jedi card
    this.savedPeople[index] = { ...this.originalPeople[index] }; // Revert changes

    // Update localStorage with reverted changes
    localStorage.setItem('savedPeople', JSON.stringify(this.savedPeople));
  }

  /**
   * Variable to hold the path for no data image of Darth Vader
   */
  protected readonly noDataDarthVader = noDataDarthVader;
}
