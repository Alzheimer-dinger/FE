/**
 * useAudioStream
 *
 * 세부사항:
 * - 사용자의 마이크에서 실시간 오디오 스트림을 가져와 음성 볼륨을 감지
 * - 볼륨 값이 일정 기준 이상이면 사용자가 말하고 있는 것으로 판단하여 `isSpeaking` 값을 true로 설정
 * - requestAnimationFrame을 활용해 연속적으로 볼륨을 분석
 * - 컴포넌트 언마운트 시 마이크 및 AudioContext 정리
 *
 * return:
 * - isSpeaking (boolean): 현재 사용자가 말하고 있는지 여부
 *
 * 사용 화면 (CallActive.tsx)
 */

import { useEffect, useState } from 'react';

export const useAudioStream = (): boolean => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let source: MediaStreamAudioSourceNode | null = null;
    let animationId: number;

    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      audioContext = new AudioContext();
      source = audioContext.createMediaStreamSource(stream);
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;

      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const checkVolume = () => {
        if (!analyser) return;

        analyser.getByteFrequencyData(dataArray);
        const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setIsSpeaking(volume > 30); // 감지 기준

        animationId = requestAnimationFrame(checkVolume);
      };

      checkVolume();
    });

    return () => {
      cancelAnimationFrame(animationId);
      audioContext?.close();
    };
  }, []);

  return isSpeaking;
};
