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
   * Inject SwapiService to access its methods.
   * SwapiService is used to fetch data from the Star Wars API.
   */
  private peopleService = inject(SwapiService)
  private _soundPlayer = inject(SoundPlayerService)

  /**
   * Observable that will emit an array of People objects containing the
   * data for Yoda, Darth Vader, and Obi-Wan Kenobi.
   */
  peopleAllThree$!: Observable<People[]>

  savedPeople: People[] = []
  originalPeople: People[] = []

  /**
   * Variable to hold error messages if any occur during data fetching.
   */
  errorMessage: string | undefined
  editModes: boolean[] = [];
  /**
   * Boolean variable to control the display of a loading spinner.
   */
  spinner: boolean = false

  /**
   * OnInit lifecycle hook to initialize the component.
   * Calls the method to fetch data and subscribes to people observable
   * to initialize editModes array based on the fetched data length.
   */
  ngOnInit() {
    this.getDesiredJedies()

    this.peopleAllThree$.subscribe(people => {
      this.editModes = new Array(people.length).fill(false); // Initialize editModes array
      this.savedPeople = [...people]; // Assuming savedPeople is initialized with the fetched data
      this.originalPeople = people.map(person => ({ ...person }));
    });
  }

  /**
   * Method to toggle edit mode for a specific Jedi card based on index.
   * @param index The index of the Jedi card to toggle edit mode.
   */
  toggleEditMode(index: number) {
    this.originalPeople[index] = { ...this.savedPeople[index] };

    this.editModes[index] = !this.editModes[index]; // Toggle edit mode for the specific Jedi card
  }

  /**
   * Fetches data for the specified names and handles loading state and errors.
   */
  getDesiredJedies() {

    /**
     * Show the spinner while loading data
     */
    this.spinner = true

    /**
     * Create an array of observables, each fetching data for one name.
     * Each observable is created using the getAllDataForPeople method of the SwapiService.
     * The catchError operator logs any errors and returns an empty array,
     * allowing the observable stream to continue.
     */
    const observables = desiredNames.map(name =>
      this.peopleService.getAllDataForPeople(name).pipe(
        catchError(error => {

          /**
           * Log error and return an empty array if an error occurs.
           */
          console.error('Error fetching data for:', name, error.message)
          return of([] as People[])
        })
      )
    );

    /**
     * Combine the results of all observables into one observable using forkJoin.
     * This waits for all observables to complete and then combines their results.
     */
    this.peopleAllThree$ = forkJoin(observables).pipe(
      /**
       * Flatten the array of arrays into a single array.
       */
      map(results => results.flat()),

      /**
       * Hide the spinner once data is loaded.
       */
      tap((people) => {
        this.spinner = false
        this.savedPeople = people
        this.originalPeople = people.map(person => ({...person}))
      }),

      /**
       * Play a sound if no data is loaded.
       */
      tap((people) => {
        if (people.length === 0)
          this._soundPlayer.playSound()
      }),

      /**
       * Handle any errors during the combining process.
       * Hide the spinner, set an error message, and return an empty array.
       */
      catchError(error => {
        console.error('Error: ', error)
        this.spinner = false
        this.errorMessage = 'Failed to load data'
        return of([] as People[])
      })
    );
  }

  saveEdited(index: number) {
    this.editModes[index] = false
  }

  cancelEdit(index: number) {
    this.editModes[index] = false
    this.savedPeople[index] = { ...this.originalPeople[index] };
  }

  protected readonly noDataDarthVader = noDataDarthVader;
}
