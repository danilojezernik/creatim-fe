/**
 * Injectable service for playing sound effects using the Howler library.
 * This service handles the initialization and playback of various sound effects
 * associated with specific events or actions within the application.
 *
 * The main functionalities included are:
 *
 * - `playSoundNoData()`: Plays the 'no data' sound effect, called when no data is available or an error occurs while fetching data.
 * - `playSoundNameChangeDarthVader()`: Plays the sound effect for Darth Vader's name change, called when the name of Darth Vader is changed in the application.
 * - `playSoundNameChangeYoda()`: Plays the sound effect for Yoda's name change, called when the name of Yoda is changed in the application.
 * - `playSoundNameChangeObiWanKenobi()`: Plays the sound effect for Obi-Wan Kenobi's name change, called when the name of Obi-Wan Kenobi is changed in the application.
 */

import { Injectable } from '@angular/core';
import { Howl } from "howler";
import { howlPath } from "../../shared/global_variables/global.const";

@Injectable({
  providedIn: 'root'
})
export class SoundPlayerService {

  /**
   * An object containing Howl instances for different sound effects.
   * Each key corresponds to a specific sound effect, and the value is a Howl instance
   * initialized with the path to the respective sound file.
   */
  private sounds = {
    soundNoData: new Howl({ src: [ howlPath.DESTROY ] }),
    soundNameChangeDarthVader: new Howl({ src: [ howlPath.DARTH_VADER ] }),
    soundNameChangeYoda: new Howl({ src: [ howlPath.YODA ] }),
    soundNameChangeObiWanKenobi: new Howl({ src: [ howlPath.OBI_WAN_KENOBI ] })
  }

  /**
   * Plays the 'no data' sound effect.
   * This method is called when no data is available or an error occurs while fetching data.
   */
  playSoundNoData() {
    this.sounds.soundNoData.play();
  }

  /**
   * Plays the sound effect for Darth Vader's name change.
   * This method is called when the name of Darth Vader is changed in the application.
   */
  playSoundNameChangeDarthVader() {
    this.sounds.soundNameChangeDarthVader.play();
  }

  /**
   * Plays the sound effect for Yoda's name change.
   * This method is called when the name of Yoda is changed in the application.
   */
  playSoundNameChangeYoda() {
    this.sounds.soundNameChangeYoda.play();
  }

  /**
   * Plays the sound effect for Obi-Wan Kenobi's name change.
   * This method is called when the name of Obi-Wan Kenobi is changed in the application.
   */
  playSoundNameChangeObiWanKenobi() {
    this.sounds.soundNameChangeObiWanKenobi.play();
  }
}
