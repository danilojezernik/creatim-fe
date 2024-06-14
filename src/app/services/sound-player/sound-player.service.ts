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
   * Initialize a new Howl instance with the path to the 'no data' sound file.
   */
  soundNoData = new Howl({
    src: ['assets/sound/destroy.mp3']
  });

  /**
   * Initialize a new Howl instance with the path to the 'name change' sound file.
   */
  soundNameChange = new Howl({
    src: ['assets/sound/traitor-no-name-change.mp3']
  });

  /**
   * Plays the 'no data' sound effect using the Howl instance.
   */
  playSoundNoData() {
    this.soundNoData.load();
    this.soundNoData.play();
  }

  /**
   * Plays the 'name change' sound effect using the Howl instance.
   */
  playSoundNameChange() {
    this.soundNameChange.load();
    this.soundNameChange.play();
  }
}
