/**
 * CodeBook Frontend Media Bridge
 * Handles browser camera frame capture & microphone recording via HTML5 Media APIs.
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
  } catch (err: any) {
    const name = err?.name || '';
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
          message: err?.message || 'Failed to capture frame from browser camera.',
        },
      };
    }
  } finally {
    // ALWAYS stop all camera media tracks after capture
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  }
}

/**
 * Requests browser microphone permission, records audio for durationSeconds, and stops all tracks immediately.
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

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
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
  } catch (err: any) {
    const name = err?.name || '';
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
          message: err?.message || 'Failed to record audio from browser microphone.',
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
