import { 
  setAudioModeAsync, 
  requestRecordingPermissionsAsync, 
  AudioModule,
  AudioRecorder, 
  RecordingPresets 
} from 'expo-audio';
import * as Speech from 'expo-speech';

/**
 * 🎙️ Audio Service for SpeakPrep AI
 * Handles high-quality voice recording and Text-to-Speech playback.
 */
class AudioServiceManager {
  private _recorder: AudioRecorder | null = null;

  /**
   * Request microphone permissions
   */
  async requestPermissions() {
    const response = await requestRecordingPermissionsAsync();
    return response.status === 'granted';
  }

  /**
   * Start recording user voice
   */
  async startRecording() {
    try {
      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      this._recorder = new AudioModule.AudioRecorder(RecordingPresets.HIGH_QUALITY);
      await this._recorder.prepareToRecordAsync();
      this._recorder.record();

      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  /**
   * Stop recording and return the URI of the audio file
   */
  async stopRecording(): Promise<string | null> {
    if (!this._recorder) return null;

    try {
      await this._recorder.stop();
      const uri = this._recorder.uri;
      this._recorder = null;

      await setAudioModeAsync({
        allowsRecording: false,
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
