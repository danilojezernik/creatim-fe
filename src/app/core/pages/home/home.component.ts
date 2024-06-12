import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwapiService } from "../../../services/api/swapi.service";
import { catchError, map, tap } from "rxjs";
import { SpinnerComponent } from "../../../shared/spinner/spinner/spinner.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ CommonModule, SpinnerComponent ],
  templateUrl: './home.component.html'
})
export class HomeComponent {

  /**
   * Inject SwapiService to access its methods
   * SwapiService is used to fetch data from the Star Wars API
   */
  private _peopleService = inject(SwapiService);

  /**
   * Variable to hold error messages if any occur during data fetching
   */
  errorMessage: string | undefined;

  /**
   * Boolean variable to control the display of a loading spinner
   */
  spinner: boolean = false;

  /**
   * Define an observable that will emit the transformed data from the API
   * The observable pipeline includes map, catchError, and tap operators
   */
  peopleAll$ = this._peopleService.getAllData().pipe(
    /**
     * Use the map operator to transform the data received from the API
     * The map function is used to extract and return the names from the data
     */
    map(data => {

      // Hide the spinner as data is received successfully
      this.spinner = false;

      /**
       * Check if data is defined, map over it to extract and return the names
       * If data is not defined, return an empty array
       */
      return data ? data.map(person => ({
        ...person,
      })) : [];
    }),
    /**
     * Use catchError to handle any errors that occur during data fetching
     */
    catchError(error => {

      // Show the spinner if an error occurs
      this.spinner = true;

      // Log the error to the console for debugging
      console.error('Error loading data:', error);

      /**
       * Store the error message in errorMessage variable
       */
      this.errorMessage = error;

      // Return an empty array to keep the observable stream alive
      return [];
    }),
    /**
     * Use tap to perform side effects such as hiding the spinner
     * once the observable emits a value
     */
    tap(_ => this.spinner = false)
  );

}
