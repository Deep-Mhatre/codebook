/**
 * CodeBook WebAudio AudioWorkletProcessor
 * Extracts PCM Float32 audio samples directly from browser microphone input stream.
 */
class AudioStreamProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0];
    if (input && input.length > 0 && input[0].length > 0) {
      const pcmData = input[0];
      this.port.postMessage(pcmData);
    }
    return true;
  }
}

registerProcessor('audio-stream-processor', AudioStreamProcessor);
