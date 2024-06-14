/**
 * Predefined list of desired names to fetch specific data from the SWAPI API.
 * This array contains the names of characters for whom data needs to be fetched.
 */
export const desiredNames = ['yoda', 'darth vader', 'obi-wan kenobi'];

/**
 * Image path to the 'no data' placeholder image.
 * This image is displayed when no data is available for the requested characters.
 */
export const noDataDarthVader = './assets/media/no-data/darth-vader-no-data.png';

/**
 * Array defining editable fields for Jedi details.
 * Each object in the array specifies:
 * - label: The display name of the field.
 * - modelProperty: The corresponding property name in the 'People' object.
 * - suffix: The unit or additional text to display after the value (if any).
 */
export const editFields = [
  { label: 'Name', modelProperty: 'name', suffix: '' },
  { label: 'Height', modelProperty: 'height', suffix: 'cm' },
  { label: 'Mass', modelProperty: 'mass', suffix: 'kg' },
  { label: 'Hair color', modelProperty: 'hair_color', suffix: '' },
  { label: 'Skin color', modelProperty: 'skin_color', suffix: '' },
  { label: 'Eye color', modelProperty: 'eye_color', suffix: '' },
  { label: 'Birth year', modelProperty: 'birth_year', suffix: '' },
  { label: 'Gender', modelProperty: 'gender', suffix: '' }
];
