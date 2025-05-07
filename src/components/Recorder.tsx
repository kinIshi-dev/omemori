"use client";

import { useRef, useState } from "react";
import { Button, Group, Stack, Text } from "@mantine/core";

export const Recorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      audioChunksRef.current = [];
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <Stack align="center" spacing="md">
      <Group>
        <Button onClick={startRecording} disabled={isRecording}>
          録音開始
        </Button>
        <Button onClick={stopRecording} disabled={!isRecording}>
          録音停止
        </Button>
      </Group>

      {audioUrl && (
        <>
          <Text size="sm" c="dimmed">
            再生:
          </Text>
          <audio controls src={audioUrl} />
        </>
      )}
    </Stack>
  );
};

export default Recorder;
