import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';

/**
 * 🎙️ Audio Service for SpeakPrep AI
 * Handles high-quality voice recording and Text-to-Speech playback.
 */
class AudioServiceManager {
  private _recording: Audio.Recording | null = null;

  /**
   * Request microphone permissions
   */
  async requestPermissions() {
    const { status } = await Audio.requestPermissionsAsync();
    return status === 'granted';
  }

  /**
   * Start recording user voice
   */
  async startRecording() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      this._recording = recording;
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  /**
   * Stop recording and return the URI of the audio file
   */
  async stopRecording(): Promise<string | null> {
    if (!this._recording) return null;

    try {
      await this._recording.stopAndUnloadAsync();
      const uri = this._recording.getURI();
      this._recording = null;
      
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      return uri;
    } catch (err) {
      console.error('Failed to stop recording', err);
      return null;
    }
  }

  /**
   * 🤖 Text-to-Speech: Speak AI response
   */
  async speak(text: string) {
    const isSpeaking = await Speech.isSpeakingAsync();
    if (isSpeaking) {
      await Speech.stop();
    }

    Speech.speak(text, {
      language: 'en-US',
      pitch: 1.0,
      rate: 1.0,
    });
  }

  /**
   * Stop all active speech
   */
  async stopSpeaking() {
    await Speech.stop();
  }
}

export const AudioService = new AudioServiceManager();
