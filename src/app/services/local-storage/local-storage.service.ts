import { Injectable } from '@angular/core'
import { LocalStorageKeys } from "../../shared/global_variables/global.const"
import { Person } from "../../models/person"

/**
 * Service for managing people data in local storage.
 *
 * This service provides functionality to save, retrieve, and update data of people stored in the browser's local storage.
 * The main functions included are:
 *
 * - `getSavedPeople()`: Retrieves an array of saved people from local storage.
 * - `updatePerson(index: number, person: Person)`: Updates a specific person in local storage by index.
 * - `setSavedPeople(array: Person[])`: Saves an array of people to local storage, clearing any previously saved data.
 * - `getJediByName(name: string)`: Retrieves a person (specifically referred to as a Jedi) from local storage based on their name.
 */

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  /**
   * Retrieves an array of saved people from local storage.
   * @returns An array of saved people, or an empty array if no data is found.
   */
  getSavedPeople(): Person[] {
    const people: Person[] = []
    let index = 0

    // Loop to retrieve saved people data from local storage
    while (true) {
      const data = localStorage.getItem(`${LocalStorageKeys.SAVED_PEOPLE}_${index}`)
      if (!data) break
      people.push(...JSON.parse(data))
      index++
    }

    return people
  }

  /**
   * Updates a specific person in local storage.
   * @param index - The index of the person to be updated.
   * @param person - The updated person object.
   */
  updatePerson(index: number, person: Person): void {
    // Convert the person object to JSON format and save it to local storage
    localStorage.setItem(`${LocalStorageKeys.SAVED_PEOPLE}_${index}`, JSON.stringify([person]))
  }

  /**
   * Saves an array of people to local storage.
   * This method first clears any previously saved data in the local storage
   * for the given key, then saves each person in the provided array
   * as a separate item in the local storage.
   *
   * @param array - The array of people to be saved. Each person in the array will be stored
   *                in local storage under a unique key.
   */
  setSavedPeople(array: Person[]): void {

    // Clear existing data in local storage for saved people
    let index = 0;
    while (localStorage.getItem(`${LocalStorageKeys.SAVED_PEOPLE}_${index}`)) {
      localStorage.removeItem(`${LocalStorageKeys.SAVED_PEOPLE}_${index}`);
      index++;
    }

    // Save each person in the array to local storage, using a unique key for each person
    array.forEach((person, index) => {
      localStorage.setItem(`${LocalStorageKeys.SAVED_PEOPLE}_${index}`, JSON.stringify([person]));
    });
  }

  /**
   * Retrieves a Jedi object from the saved people based on the provided name.
   * @param name - The name of the Jedi to search for.
   * @returns The Jedi object if found, otherwise undefined.
   * @remarks
   * This method uses case-insensitive comparison by converting both the
   * Jedi IDs and the provided name to lowercase using .toLowerCase().
   * Edge cases to consider include non-standard characters, Unicode
   * variations, and locale-specific behaviors affecting string comparison.
   */
  getJediByName(name: string): Person | undefined {
    // Retrieve the saved people array and find the Jedi object matching the provided name (case-insensitive).
    return this.getSavedPeople().find((jedi) => jedi.id.toLowerCase() == name.toLowerCase())
  }
}
