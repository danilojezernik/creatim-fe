import { Injectable } from '@angular/core';
import { LocalStorageKeys } from "../../shared/global_variables/global.const";
import { Person } from "../../models/person";

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  /**
   * Retrieves an array of saved people from local storage.
   * @returns An array of saved people, or an empty array if no data is found.
   */
  getSavedPeople(): Person[] {
    // Retrieve the data from local storage using the provided key.
    const data = localStorage.getItem(LocalStorageKeys.SAVED_PEOPLE);

    /**
     * If data is found, parse it from JSON format and return it as an array of Person objects.
     * If no data is found, return an empty array.
     */
    return data ? JSON.parse(data) : [];
  }

  /**
   * Saves an array of people to local storage.
   * @param array - The array of people to be saved.
   */
  setSavedPeople(array: Person[]): void {
    // Convert the array of Person objects to JSON format and save it to local storage using the provided key.
    localStorage.setItem(LocalStorageKeys.SAVED_PEOPLE, JSON.stringify(array));
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
    return this.getSavedPeople().find((jedi) => jedi.id.toLowerCase() == name.toLowerCase());
  }
}
