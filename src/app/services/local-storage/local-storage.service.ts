import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  /**
   * Retrieves an array of saved people from local storage.
   *
   * @param storageKey - The key under which the data is stored in local storage.
   * @returns An array of saved people, or an empty array if no data is found.
   */
  getSavedPeople(storageKey: string): any[] {
    // Retrieve the data from local storage using the provided key.
    const data = localStorage.getItem(storageKey);

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
  setSavedPeople(storageKey: string, array: any[]): void {
    // Convert the array to JSON format and save it to local storage using the provided key.
    localStorage.setItem(storageKey, JSON.stringify(array));
  }

}
