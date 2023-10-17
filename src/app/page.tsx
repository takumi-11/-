// import AudioUploader from './AudioUploader';

"use client";
import React, { useState } from 'react';
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";


export default function Home() {
  const ffmpeg = createFFmpeg({ log: true });
  const [audio, setAudio] = useState<File | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudio(file);
    }
  };

  const splitAudio = async () => {
    if (!audio) return;

    await ffmpeg.load();
    ffmpeg.FS('writeFile', 'input.mp3', await fetchFile(audio));

    const fileSizeInMB = audio.size / (1024 * 1024);
    if (fileSizeInMB > 25) {
      // ここでffmpegコマンドを実行して音声ファイルを分割します。
      // 分割方法は、ffmpegのコマンドによって変わります。
      // 以下は例として5秒ごとに分割するコマンドを示しています。
      await ffmpeg.run('-i', 'input.mp3', '-f', 'segment', '-segment_time', '5', 'output%03d.mp3');

      const files = ffmpeg.FS('readdir', '/').filter((name: string) => name.startsWith('output'));
      const blobs: Blob[] = files.map(name => new Blob([ffmpeg.FS('readFile', name)], { type: 'audio/mp3' }));
      setAudioChunks(blobs);
    }
  };




  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={splitAudio}>Split</button>

      {audioChunks.map((blob, index) => (
        <audio key={index} controls src={URL.createObjectURL(blob)} />
      ))}
    </div>
  );
  // return (
  // <>
  //   <h1>音声ファイルアップローダ</h1>
  //   <AudioUploader />
  // </>
  // )
}
