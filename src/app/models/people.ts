/**
 * Interface representing a person from the Star Wars API (SWAPI).
 * Each property corresponds to an attribute of a character.
 */
export interface People {
  /**
   * The name of the person.
   * Example: "Luke Skywalker"
   */
  name: string;

  /**
   * The height of the person in centimeters.
   * Example: "172"
   */
  height: string;

  /**
   * The mass (weight) of the person in kilograms.
   * Example: "77"
   */
  mass: string;

  /**
   * The hair color of the person.
   * Example: "blond"
   */
  hair_color: string;

  /**
   * The skin color of the person.
   * Example: "fair"
   */
  skin_color: string;

  /**
   * The eye color of the person.
   * Example: "blue"
   */
  eye_color: string;

  /**
   * The birth year of the person.
   * This can be a relative term in the Star Wars universe, often noted as BBY (Before the Battle of Yavin) or ABY (After the Battle of Yavin).
   * Example: "19BBY"
   */
  birth_year: string;

  /**
   * The gender of the person.
   * Example: "male", "female", "n/a"
   */
  gender: string;
}
