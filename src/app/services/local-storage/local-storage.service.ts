import { Injectable } from '@angular/core';
import { LocalStorageKeys } from "../../shared/global_variables/global.const";
import { People } from "../../models/people";

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  /**
   * Retrieves an array of saved people from local storage.
   *
   * @returns An array of saved people, or an empty array if no data is found.
   */
  getSavedPeople(): People[] {
    // Retrieve the data from local storage using the provided key.
    const data = localStorage.getItem(LocalStorageKeys.SAVED_PEOPLE);

    /**
     * If data is found, parse it from JSON format and return it.
     * If no data is found, return an empty array.
     */
    return data ? JSON.parse(data) : [];
  }

  /**
   * Saves an array of people to local storage.
   *
   * @param storageKey - The key under which the data should be stored in local storage.
   * @param array - The array of people to be saved.
   */
  setSavedPeople(array: any[]): void {
    // Convert the array to JSON format and save it to local storage using the provided key.
    localStorage.setItem(LocalStorageKeys.SAVED_PEOPLE, JSON.stringify(array));
  }

  getJediByName(name: string) {
    const localJedi = this.getSavedPeople().find((jedi) => jedi.id.toLowerCase() == name.toLowerCase())
    console.log(name, this.getSavedPeople(), localJedi != undefined)
    return localJedi
  }

}
