let audioContext: AudioContext | null = null
let stream: MediaStream | null = null
let analyserNode: AnalyserNode | null = null
let sourceNode: MediaStreamAudioSourceNode | null = null
let animationFrameId: number | null = null

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  }
  return audioContext
}

export function getAudioConstraints(): MediaStreamConstraints {
  return {
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      sampleRate: 16000,
      channelCount: 1,
    },
  }
}

export async function startAudioStream(
  onAudioLevel?: (level: number) => void
): Promise<MediaStream> {
  const constraints = getAudioConstraints()
  stream = await navigator.mediaDevices.getUserMedia(constraints)

  if (onAudioLevel) {
    const ctx = getAudioContext()
    sourceNode = ctx.createMediaStreamSource(stream)
    analyserNode = ctx.createAnalyser()
    analyserNode.fftSize = 256
    sourceNode.connect(analyserNode)

    const bufferLength = analyserNode.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const updateLevel = () => {
      if (!analyserNode) return
      analyserNode.getByteFrequencyData(dataArray)
      let sum = 0
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i]
      }
      const average = sum / bufferLength
      const level = Math.min(1, average / 128)
      onAudioLevel(level)
      animationFrameId = requestAnimationFrame(updateLevel)
    }

    if (ctx.state === 'suspended') {
      await ctx.resume()
    }

    updateLevel()
  }

  return stream
}

export function stopAudioStream(): void {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }

  if (sourceNode) {
    sourceNode.disconnect()
    sourceNode = null
  }

  if (analyserNode) {
    analyserNode.disconnect()
    analyserNode = null
  }

  if (stream) {
    stream.getTracks().forEach((track) => track.stop())
    stream = null
  }
}

export async function playAudio(audioData: ArrayBuffer | Blob): Promise<void> {
  const ctx = getAudioContext()

  if (ctx.state === 'suspended') {
    await ctx.resume()
  }

  const arrayBuffer = audioData instanceof Blob ? await audioData.arrayBuffer() : audioData
  const audioBuffer = await ctx.decodeAudioData(arrayBuffer)

  const source = ctx.createBufferSource()
  source.buffer = audioBuffer
  source.connect(ctx.destination)
  source.start(0)

  return new Promise((resolve) => {
    source.onended = () => resolve()
  })
}

export function isAudioRecordingSupported(): boolean {
  return !!(
    navigator.mediaDevices &&
    'getUserMedia' in navigator.mediaDevices &&
    !!(window.MediaRecorder || (window as unknown as { webkitMediaRecorder?: typeof MediaRecorder }).webkitMediaRecorder)
  )
}

export function cleanupAudio(): void {
  stopAudioStream()
  if (audioContext) {
    audioContext.close()
    audioContext = null
  }
}
