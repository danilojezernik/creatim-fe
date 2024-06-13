/**
 * Injectable service for playing sound effects using the Howler library.
 */
import { Injectable } from '@angular/core';
import { Howl } from "howler";

@Injectable({
  providedIn: 'root'
})
export class SoundPlayerService {

  /**
   * Initialize a new Howl instance with the path to the sound file.
   */
  sound = new Howl({
    src: ['assets/sound/destroy.mp3']
  })

  /**
   * Plays the loaded sound using the Howl instance.
   */
  playSound() {
    this.sound.play();
  }
}
