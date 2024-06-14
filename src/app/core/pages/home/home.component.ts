import { Component, inject, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SwapiService } from "../../../services/api/swapi.service"
import { catchError, forkJoin, map, Observable, of, tap } from "rxjs"
import { SpinnerComponent } from "../../../shared/spinner/spinner/spinner.component"
import { People } from "../../../models/people"
import { desiredNames, noDataDarthVader, editFields } from "../../../shared/global_variables/global.const"
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
   * Private injection of SwapiService instance for fetching data from SWAPI API.
   * Used to retrieve data for specific character names defined in desiredNames.
   */
  private _peopleService = inject(SwapiService);

  /**
   * Private injection of SoundPlayerService instance for playing sounds.
   * Used to play a sound when no data is fetched or an error occurs.
   */
  private _soundPlayer = inject(SoundPlayerService);

  /**
   * Observable that emits an array of People objects containing data for Yoda, Darth Vader, and Obi-Wan Kenobi.
   */
  peopleAllThree$!: Observable<People[]>;

  /**
   * Array to store the current edited version of People data.
   */
  savedPeople: People[] = [];

  /**
   * Array to store the original People data fetched from API or localStorage.
   */
  originalPeople: People[] = [];

  /**
   * Path to the image file for displaying when no data is available for Darth Vader.
   */
  protected readonly noDataDarthVader = noDataDarthVader;

  /**
   * Array defining editable fields for Jedi details.
   * Each object specifies a label and the corresponding property in the 'People' object.
   */
  protected readonly editFields = editFields;

  /**
   * Variable to hold error message if any error occurs during data fetching.
   */
  errorMessage: string | undefined;

  /**
   * Array to track the edit mode status for each Jedi card.
   */
  editModes: boolean[] = [];

  /**
   * Boolean variable to control the display of the loading spinner.
   * Set to true when data is being fetched.
   */
  spinner: boolean = false;

  /**
   * OnInit lifecycle hook to initialize the component.
   * Calls getDesiredJedies() method to fetch and initialize data.
   */
  ngOnInit() {
    this.getDesiredJedies();
  }

  /**
   * Method to fetch data for the predefined names and handle loading state, errors, and local storage operations.
   */
  getDesiredJedies() {
    this.spinner = true; // Show the spinner while loading data

    // Fetch savedPeople array from local storage
    const savedPeopleFromLocalStorage$ = of(JSON.parse(localStorage.getItem('savedPeople') || '[]'));

    // Create observables for fetching data for each name in desiredNames array
    const observables = desiredNames.map(name =>
      this._peopleService.getAllDataForPeople(name).pipe(
        catchError(error => {
          console.error('Error fetching data for:', name, error.message);
          return of([] as People[]); // Return empty array in case of error
        })
      )
    );

    // Combine observables to fetch data from both local storage and SWAPI API
    const combinedObservables = [ savedPeopleFromLocalStorage$, ...observables ];

    // Combine results from observables and handle them
    this.peopleAllThree$ = forkJoin(combinedObservables).pipe(
      map(results => {
        // Extract data from local storage and API responses
        const localStorageData = results[0] as People[];

        console.log(localStorageData)

        const apiData = results.slice(1).flat() as People[];

        console.log(apiData)

        // Merge unique data from both sources
        const uniquePeople = [ ...localStorageData ];

        apiData.forEach(person => {
          if (!uniquePeople.some(p => p.name === person.name)) {
            uniquePeople.push(person);
          }
        });
        return uniquePeople;
      }),
      tap((people) => {
        // Update component state after data is fetched successfully
        this.spinner = false;
        this.savedPeople = people;
        this.originalPeople = people.map(person => ({ ...person }));
        localStorage.setItem('savedPeople', JSON.stringify(people));

        // Play sound if no data is fetched
        if (people.length === 0) {
          this._soundPlayer.playSound();
        }
      }),
      catchError(error => {
        // Handle errors during data fetching
        console.error('Error: ', error);
        this.spinner = false;
        this.errorMessage = ''; // Clear errorMessage
        return of([] as People[]);
      })
    );
  }

  /**
   * Method to toggle edit mode for a specific Jedi card based on index.
   * @param index The index of the Jedi card to toggle edit mode.
   */
  toggleEditMode(index: number) {
    this.editModes[index] = !this.editModes[index]; // Toggle edit mode
    this.originalPeople[index] = { ...this.savedPeople[index] }; // Save original data
  }

  /**
   * Method to save edited data for a specific Jedi card based on index.
   * @param index The index of the Jedi card being edited.
   */
  saveEdited(index: number) {
    this.editModes[index] = false; // Exit edit mode
    this.savedPeople[index] = { ...this.savedPeople[index] }; // Save edited data

    // Update localStorage with savedPeople data
    localStorage.setItem('savedPeople', JSON.stringify(this.savedPeople));
  }

  /**
   * Method to cancel edit mode and revert changes for a specific Jedi card based on index.
   * @param index The index of the Jedi card being edited.
   */
  cancelEdit(index: number) {
    this.editModes[index] = false; // Exit edit mode
    this.savedPeople[index] = { ...this.originalPeople[index] }; // Revert changes

    // Update localStorage with reverted changes
    localStorage.setItem('savedPeople', JSON.stringify(this.savedPeople));
  }


}
