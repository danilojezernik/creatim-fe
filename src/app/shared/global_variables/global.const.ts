/**
 * Predefined list of desired names to fetch specific data from the SWAPI API.
 * This array contains the names of characters for whom data needs to be fetched.
 */
export const desiredNames = [ 'Yoda', 'Darth Vader', 'Obi-Wan Kenobi' ]

/**
 * Image path to the 'no data' placeholder image.
 * This image is displayed when no data is available for the requested characters.
 */
export const noDataDarthVader = './assets/media/no-data/darth-vader-no-data.png'

/**
 * Array defining editable fields for Jedi details.
 * Each object in the array specifies:
 * - type: The type of the input field.
 * - label: The display name of the field.
 * - modelProperty: The corresponding property name in the 'People' object.
 * - suffix: The unit or additional text to display after the value (if any).
 */
export const editFields = [
  { type: 'text', label: 'Name', modelProperty: 'name', suffix: '' },
  { type: 'number', label: 'Height', modelProperty: 'height', suffix: 'cm' },
  { type: 'number', label: 'Mass', modelProperty: 'mass', suffix: 'kg' },
  { type: 'text', label: 'Hair color', modelProperty: 'hair_color', suffix: '' },
  { type: 'text', label: 'Skin color', modelProperty: 'skin_color', suffix: '' },
  { type: 'text', label: 'Eye color', modelProperty: 'eye_color', suffix: '' },
  { type: 'text', label: 'Birth year', modelProperty: 'birth_year', suffix: '' },
  { type: 'text', label: 'Gender', modelProperty: 'gender', suffix: '' }
]

/**
 * Enum for local storage keys used in the application.
 * This enum defines the keys that are used to store and retrieve data from local storage.
 * Using an enum helps to avoid hardcoding string literals throughout the code, making it more maintainable and less error-prone.
 */
export enum LocalStorageKeys {
  SAVED_PEOPLE = 'savedPeople' // Key used to store and retrieve the array of saved people
}

/**
 * Enum for button text used in the application.
 * This enum defines the texts used for different buttons such as save, edit, and cancel.
 * Using an enum helps to avoid hardcoding string literals throughout the code, making it more maintainable and less error-prone.
 */
export enum buttonText {
  SAVE = 'Save',
  EDIT = 'Edit',
  CANCEL = 'Cancel'
}


export const spinnerText = {
  LOADING_TEXT: 'Loading',
  LOADING_TITLE: 'Star Wars loader'
}
