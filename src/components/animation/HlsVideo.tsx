import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

export const HlsVideo = ({ flip = false, overlay = "bg-black/20" }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const source = "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8";

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(source);
      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    }
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className={`absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2 ${flip ? 'scale-y-[-1]' : ''}`}
      />
      <div className={`absolute inset-0 ${overlay}`} />
    </div>
  );
};