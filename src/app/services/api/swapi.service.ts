import { inject, Injectable } from '@angular/core'
import { HttpClient, HttpErrorResponse } from "@angular/common/http"
import { catchError, forkJoin, map, mergeMap, Observable, of, throwError, toArray } from "rxjs"
import { Person } from "../../models/person"
import { environment } from "../../../environments/environment"
import { LocalStorageService } from "../local-storage/local-storage.service"

/**
 * Service for interacting with the SWAPI (Star Wars API) to fetch data about people.
 *
 * This service provides functionality to search for people by name and retrieve their data from the SWAPI API.
 * It also checks local storage for cached data before making API requests. The main functions included are:
 *
 * - `getAllDataForPeople(name: string)`: Searches for a person by name and retrieves their data from the SWAPI API.
 *   If the person is found in local storage, it returns the local data instead.
 * - `getPeopleByName(names: string[])`: Searches for multiple people by their names and retrieves their data from the SWAPI API.
 *   This method handles errors gracefully by returning an empty array for names that encounter an error during the fetch process.
 */

@Injectable({
  providedIn: 'root'
})
export class SwapiService {

  /**
   * Inject HttpClient instance for making HTTP requests
   */
  private _http = inject(HttpClient)

  /**
   * Inject LocalStorageService instance for accessing local storage data.
   */
  private _localStorageService = inject(LocalStorageService)

  /**
   * Method to get specific people data from the SWAPI API based on name search.
   * @param name - the name to search for.
   * @returns Observable<Person[]> - an observable emitting an array of Person objects.
   */
  getAllDataForPeople(name: string): Observable<Person[]> {

    /**
     * Check if the requested Jedi is already stored in local storage
     * If found, return the local data as an Observable
     */
    const localJedi = this._localStorageService.getJediByName(name)
    if (localJedi)
      return of([ localJedi ])

    /**
     * Make an HTTP GET request to the SWAPI people endpoint with search parameter
     * The expected response type is an object containing a 'results' array of Person objects.
     */
    return this._http.get<{ results: Person[] }>(`${environment.url}/?search=${name}`).pipe(
      /**
       * Use map operator to extract the 'results' array from the response
       */
      map(response => response.results),

      /**
       * Additional mapping to handle specific data processing
       * - Throw an error if no data is found
       * - Set the Jedi's id to their name for consistency
       */
      map((data) => {

        /**
         * Check if the data array is empty.
         * If no results are found, throw an error with a custom message.
         */
        if (data.length == 0) {
          throw new Error('The Jedi you are looking for is not here!')
        }

        /**
         * Extract the first Jedi from the data array.
         * Set the Jedi's id property to their name for consistency and identification.
         */
        const jedi = data[0]
        jedi.id = jedi.name

        /**
         * Return the processed data array.
         */
        return data
      }),

      /**
       * Use catchError to handle any errors that occur during the HTTP request
       * @param error - the error response from the HTTP request
       * @returns Observable that throws a custom error message
       */
      catchError((error: HttpErrorResponse) => {
        // Log the error for debugging purposes.
        console.error('Error fetching data:', error.message)
        // Throwing a custom error message to be caught by the component
        return throwError('Data not available. Please try again later or contact us.')
      })
    )
  }

  /**
   * Method to fetch data for multiple people based on their names.
   * @param names - An array of names to search for.
   * @returns Observable<Person[]> - An observable emitting an array of Person objects.
   */
  getPeopleByName(names: string[]) {
    /**
     * Create an array of observables, each fetching data for a specific Jedi name.
     * If an error occurs while fetching data for a specific name, it logs the error and returns an empty array.
     */
    const observables = names.map(name =>
      this.getAllDataForPeople(name).pipe(
        catchError(error => {
          console.error('Error fetching data for:', name, error.message)
          return of([] as Person[]) // Return empty array in case of error
        })
      )
    )

    /**
     * Use forkJoin to combine multiple observables into one observable emitting an array of arrays of Person objects.
     * Flatten the array of arrays into a single array of Person objects.
     */
    return forkJoin(observables).pipe(
      mergeMap(results => results), // Flatten the array of arrays
      mergeMap(personArray => personArray), // Flatten the inner arrays
      toArray() // Collect all items into a single array
    );
  }


}
