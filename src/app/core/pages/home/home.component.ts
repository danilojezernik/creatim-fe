import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwapiService } from "../../../services/api/swapi.service";
import { catchError, forkJoin, map, Observable, of, tap } from "rxjs";
import { SpinnerComponent } from "../../../shared/spinner/spinner/spinner.component";
import { People } from "../../../models/people";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ CommonModule, SpinnerComponent ],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  /**
   * Inject SwapiService to access its methods.
   * SwapiService is used to fetch data from the Star Wars API.
   */
  private _peopleService = inject(SwapiService);

  /**
   * Observable that will emit an array of People objects containing the
   * data for Yoda, Darth Vader, and Obi-Wan Kenobi.
   */
  peopleAllThree$!: Observable<People[]>;

  /**
   * Variable to hold error messages if any occur during data fetching.
   */
  errorMessage: string | undefined;

  /**
   * Boolean variable to control the display of a loading spinner.
   */
  spinner: boolean = false;

  /**
   * OnInit lifecycle hook to initialize the component.
   */
  ngOnInit() {
    this.getDesiredJedies();
  }

  /**
   * Fetches data for the specified names and handles loading state and errors.
   */
  getDesiredJedies() {
    const desiredNames = [ 'yoda', 'Darth Vader', 'Obi-Wan Kenobi' ];

    /**
     * Show the spinner while loading data
     */
    this.spinner = true;

    /**
     * Create an array of observables, each fetching data for one name.
     * Each observable is created using the getAllDataForPeople method of the SwapiService.
     * The catchError operator logs any errors and returns an empty array,
     * allowing the observable stream to continue.
     */
    const observables = desiredNames.map(name =>
      this._peopleService.getAllDataForPeople(name).pipe(
        catchError(error => {

          /**
           * Log error and return an empty array if an error occurs.
           */
          console.error('Error fetching data for:', name, error.message);
          return of([] as People[]);
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
      tap(() => this.spinner = false),

      /**
       * Handle any errors during the combining process.
       * Hide the spinner, set an error message, and return an empty array.
       */
      catchError(error => {
        console.error('Error: ', error)
        this.spinner = false;
        this.errorMessage = 'Failed to load data';
        return of([] as People[]);
      })
    );
  }

}
