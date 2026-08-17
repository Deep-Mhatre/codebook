/**
 * CodeBook Frontend Media Bridge
 * Handles browser camera frame capture, streaming & microphone recording/streaming via HTML5 Media APIs.
 */

export interface MediaCaptureError {
  errorType: 'permission_denied' | 'device_not_found' | 'unsupported' | 'unknown';
  message: string;
}

/**
 * Requests browser camera permission, captures a single frame, and stops all video tracks immediately.
 */
export async function captureCameraFrame(): Promise<{ dataUrl?: string; error?: MediaCaptureError }> {
  if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    return {
      error: {
        errorType: 'unsupported',
        message: 'Browser does not support HTML5 mediaDevices API.',
      },
    };
  }

  let stream: MediaStream | null = null;
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
      audio: false,
    });

    const video = document.createElement('video');
    video.srcObject = stream;
    video.setAttribute('playsinline', 'true');
    video.muted = true;
    await video.play();

    // Give camera brief stabilization delay
    await new Promise((resolve) => setTimeout(resolve, 250));

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to acquire 2D canvas rendering context.');
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');

    return { dataUrl };
  } catch (err: unknown) {
    const errorObj = err as { name?: string; message?: string };
    const name = errorObj?.name || '';
    if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
      return {
        error: {
          errorType: 'permission_denied',
          message: 'Camera permission denied by user in browser.',
        },
      };
    } else if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
      return {
        error: {
          errorType: 'device_not_found',
          message: 'No camera hardware device found.',
        },
      };
    } else {
      return {
        error: {
          errorType: 'unknown',
          message: errorObj?.message || 'Failed to capture frame from browser camera.',
        },
      };
    }
  } finally {
    // ALWAYS stop all video media tracks after capture
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  }
}

/**
 * Requests browser microphone permission, records audio for durationSeconds, and returns a Base64 data URL.
 */
export async function recordMicrophoneAudio(
  durationSeconds: number = 5.0
): Promise<{ dataUrl?: string; sampleRate?: number; error?: MediaCaptureError }> {
  if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    return {
      error: {
        errorType: 'unsupported',
        message: 'Browser does not support HTML5 mediaDevices API.',
      },
    };
  }

  let stream: MediaStream | null = null;
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });

    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const audioContext = new AudioContextClass();
    const sampleRate = audioContext.sampleRate || 44100;

    const mediaRecorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    const recordingPromise = new Promise<Blob>((resolve, reject) => {
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        resolve(audioBlob);
      };
      mediaRecorder.onerror = (e) => reject(e);
    });

    mediaRecorder.start();

    // Automatically stop after requested duration
    await new Promise((resolve) => setTimeout(resolve, Math.max(0.5, durationSeconds) * 1000));

    if (mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }

    const audioBlob = await recordingPromise;
    audioContext.close();

    // Convert Blob to Base64 data URL
    const reader = new FileReader();
    const dataUrlPromise = new Promise<string>((resolve) => {
      reader.onloadend = () => resolve(reader.result as string);
    });
    reader.readAsDataURL(audioBlob);
    const dataUrl = await dataUrlPromise;

    return { dataUrl, sampleRate };
  } catch (err: unknown) {
    const errorObj = err as { name?: string; message?: string };
    const name = errorObj?.name || '';
    if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
      return {
        error: {
          errorType: 'permission_denied',
          message: 'Microphone permission denied by user in browser.',
        },
      };
    } else if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
      return {
        error: {
          errorType: 'device_not_found',
          message: 'No microphone hardware device found.',
        },
      };
    } else {
      return {
        error: {
          errorType: 'unknown',
          message: errorObj?.message || 'Failed to record audio from browser microphone.',
        },
      };
    }
  } finally {
    // ALWAYS stop all microphone media tracks after recording
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  }
}

/**
 * Continuously streams camera frames at target FPS over onFrame callback.
 * Returns a stopStream cleanup function to cancel streaming and close media tracks.
 */
export function streamCameraFrames(
  fps: number = 30,
  onFrame: (dataUrl: string) => void,
  onError?: (err: MediaCaptureError) => void
): () => void {
  let isStreaming = true;
  let mediaStream: MediaStream | null = null;
  let timerId: ReturnType<typeof setInterval> | null = null;

  async function start() {
    try {
      if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        if (onError) {
          onError({ errorType: 'unsupported', message: 'Browser does not support mediaDevices API.' });
        }
        return;
      }

      mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false,
      });

      const video = document.createElement('video');
      video.srcObject = mediaStream;
      video.setAttribute('playsinline', 'true');
      video.muted = true;
      await video.play();

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');

      const intervalMs = Math.max(16, Math.floor(1000 / fps));

      timerId = setInterval(() => {
        if (!isStreaming || !ctx) return;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        onFrame(dataUrl);
      }, intervalMs);
    } catch (err: unknown) {
      if (onError) {
        const errorObj = err as { message?: string };
        onError({
          errorType: 'permission_denied',
          message: errorObj?.message || 'Failed to start camera stream',
        });
      }
    }
  }

  start();

  return () => {
    isStreaming = false;
    if (timerId) clearInterval(timerId);
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
    }
  };
}

/**
 * Continuously streams microphone audio chunks over onAudioChunk callback.
 * Returns a stopStream cleanup function to cancel streaming and close media tracks.
 */
export function streamMicrophoneAudio(
  chunkSeconds: number = 0.1,
  onAudioChunk: (audioDataUrl: string, sampleRate: number) => void,
  onError?: (err: MediaCaptureError) => void
): () => void {
  let isStreaming = true;
  let mediaStream: MediaStream | null = null;
  let audioContext: AudioContext | null = null;

  async function start() {
    try {
      if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        if (onError) {
          onError({ errorType: 'unsupported', message: 'Browser does not support mediaDevices API.' });
        }
        return;
      }

      mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioContext = new AudioContextClass();
      const sampleRate = audioContext.sampleRate || 44100;
      const mediaRecorder = new MediaRecorder(mediaStream);

      const intervalMs = Math.max(50, Math.floor(chunkSeconds * 1000));

      mediaRecorder.ondataavailable = (e) => {
        if (!isStreaming || e.data.size === 0) return;
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result && typeof reader.result === 'string') {
            onAudioChunk(reader.result, sampleRate);
          }
        };
        reader.readAsDataURL(e.data);
      };

      mediaRecorder.start(intervalMs);
    } catch (err: unknown) {
      if (onError) {
        const errorObj = err as { message?: string };
        onError({
          errorType: 'permission_denied',
          message: errorObj?.message || 'Failed to start microphone stream',
        });
      }
    }
  }

  start();

  return () => {
    isStreaming = false;
    if (audioContext) audioContext.close();
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
    }
  };
}
