import { inject, Injectable } from '@angular/core'
import { HttpClient, HttpErrorResponse } from "@angular/common/http"
import { catchError, map, Observable, of, throwError } from "rxjs"
import { People } from "../../models/people"
import { environment } from "../../../environments/environment"
import { LocalStorageService } from "../local-storage/local-storage.service";

@Injectable({
  providedIn: 'root'
})
export class SwapiService {

  /**
   * Inject HttpClient instance for making HTTP requests
   */
  private _http = inject(HttpClient)
  private _localStorageService = inject(LocalStorageService)

  /**
   * Method to get specific people data from the SWAPI API based on name search
   * @param name - the name to search for
   * @returns Observable<People[]> - an observable emitting an array of People
   */
  getAllDataForPeople(name: string): Observable<People[]> {

    const localJedi = this._localStorageService.getJediByName(name)
    if (localJedi)
      return of([ localJedi ])
    /**
     * Make an HTTP GET request to the SWAPI people endpoint with search parameter
     * The expected response type is an object containing a 'results' array of People
     */
    return this._http.get<{ results: People[] }>(`${environment.url}/?search=${name}`).pipe(
      /**
       * Use map operator to extract the 'results' array from the response
       */
      map(response => response.results),

      map((data) => {

        if (data.length == 0) {
          throw new Error('The Jedi you are looking for is not here!')
        }

        const jedi = data[0]
        jedi.id = jedi.name

        return data
      }),

      /**
       * Use catchError to handle any errors that occur during the HTTP request
       * @param error - the error response from the HTTP request
       * @returns Observable that throws a custom error message
       */
      catchError((error: HttpErrorResponse) => {
        // Handle the error based on your application's requirements
        console.error('Error fetching data:', error.message)
        // Throwing a custom error message to be caught by the component
        return throwError('Data not available. Please try again later or contact us.')
      })
    )
  }
}
