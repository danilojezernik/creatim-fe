import { Component, inject, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SwapiService } from "../../../services/api/swapi.service"
import { catchError, forkJoin, map, Observable, of, tap } from "rxjs"
import { SpinnerComponent } from "../../../shared/spinner/spinner/spinner.component"
import { People } from "../../../models/people"
import { desiredNames, noDataDarthVader } from "../../../shared/global_variables/global.const"
import { SoundPlayerService } from "../../../services/sound-player/sound-player.service"
import { FormsModule } from "@angular/forms"

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ CommonModule, SpinnerComponent, FormsModule ],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  /**
   * Inject SwapiService to access methods for fetching Star Wars API data.
   * Private access ensures encapsulation and adherence to best practices.
   */

  private _swapService = inject(SwapiService)
  private _soundPlayerService = inject(SoundPlayerService)

  /**
   * Constant variable to hold the path for the no data image of Darth Vader.
   */
  protected readonly noDataDarthVader = noDataDarthVader;

  /**
   * Observable that will emit an array of People objects for Yoda, Darth Vader, and Obi-Wan Kenobi.
   */
  peopleAllThree$!: Observable<People[]>;

  /**
   * Arrays to hold the saved and original people data.
   */
  savedPeople: People[] = [];
  originalPeople: People[] = [];

  /**
   * Variables to store data in localStorage.
   */
  localStorageOriginal: any;
  localStorageSave: any;

  /**
   * Variable to hold error messages if any occur during data fetching.
   */
  errorMessage: string | undefined;

  /**
   * Array to track edit modes for each Jedi card.
   */
  editModes: boolean[] = [];

  /**
   * Boolean variable to control the display of a loading spinner.
   */
  spinner: boolean = false;

  /**
   * OnInit lifecycle hook to initialize the component.
   * Fetches data and subscribes to the people observable to initialize editModes array.
   */
  ngOnInit() {
    this.getDesiredJedies();

    /**
     * Subscribe to the people observable to initialize data and edit modes.
     * Clones fetched data to savedPeople and originalPeople arrays for editing functionality.
     * Saves data in localStorage for persistence across page reloads.
     */
    this.peopleAllThree$.subscribe(people => {
      this.editModes = new Array(people.length).fill(false); // Initialize editModes array

      this.savedPeople = [...people]; // Clone fetched data to savedPeople
      this.localStorageOriginal = JSON.stringify(this.savedPeople);
      localStorage.setItem('saved', this.localStorageOriginal);

      this.originalPeople = people.map(person => ({ ...person })); // Clone fetched data to originalPeople
      this.localStorageSave = JSON.stringify(this.originalPeople);
      localStorage.setItem('original', this.localStorageSave);
    });
  }

  /**
   * Method to toggle edit mode for a specific Jedi card based on index.
   * @param index The index of the Jedi card to toggle edit mode.
   */
  toggleEditMode(index: number) {
    /**
     * Clone the current state of the savedPeople data for the specific index.
     */
    this.originalPeople[index] = { ...this.savedPeople[index] };
    this.editModes[index] = !this.editModes[index]; // Toggle edit mode for the specific Jedi card
  }

  /**
   * Fetches data for the specified names and handles loading state and errors.
   */
  getDesiredJedies() {
    this.spinner = true; // Show the spinner while loading data

    /**
     * Create an array of observables, each fetching data for one name using SwapiService.
     * Handle errors for each observable, log the error, and return an empty array.
     */
    const observables = desiredNames.map(name =>
      this._swapService.getAllDataForPeople(name).pipe(
        catchError(error => {
          console.error('Error fetching data for:', name, error.message);
          return of([] as People[]);
        })
      )
    );

    /**
     * Combine the results of all observables into one observable using forkJoin.
     * Flatten the array of arrays into a single array.
     * Hide the spinner once data is loaded.
     * Play a sound if no data is loaded.
     * Handle any errors during the combining process.
     */
    this.peopleAllThree$ = forkJoin(observables).pipe(
      map(results => results.flat()), // Flatten the array of arrays into a single array
      tap((people) => {
        this.spinner = false;
        this.savedPeople = people; // Update savedPeople with loaded data
        this.originalPeople = people.map(person => ({ ...person })); // Update originalPeople with loaded data
      }),
      tap((people) => {
        if (people.length === 0) {
          this._soundPlayerService.playSound(); // Play a sound if no data is loaded
        }
      }),
      catchError(error => {
        console.error('Error: ', error);
        this.spinner = false;
        this.errorMessage = 'Failed to load data'; // Handle any errors during the combining process
        return of([] as People[]);
      })
    );
  }

  /**
   * Method to cancel the edit mode for a specific index.
   * @param index The index of the Jedi card being edited.
   */
  cancelEdit(index: number) {
    this.editModes[index] = false; // Exit edit mode for the specific Jedi card
  }

  /**
   * Method to save the edited data for a specific index.
   * @param index The index of the Jedi card being edited.
   */
  saveEdited(index: number) {
    this.editModes[index] = false; // Exit edit mode for the specific Jedi card
    this.savedPeople[index] = { ...this.originalPeople[index] };

    // Convert your data to JSON string
    const dataToStore = JSON.stringify(this.savedPeople);
    // Store in localStorage under a specific key, for example, 'savedPeople'
    localStorage.setItem('savedPeople', dataToStore);
  }

}
