import React, { useState, useRef } from 'react';
import {Button, Container} from "@mui/material";
import MicIcon from '@mui/icons-material/Mic';
import StopCircleIcon from '@mui/icons-material/StopCircle';

function AudioTest() {

    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = event => {
            audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            const url = URL.createObjectURL(audioBlob);
            setAudioUrl(url);
        };

        mediaRecorder.start();
        setIsRecording(true);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    return (
        <Container>
            {!isRecording && (
            <MicIcon onClick={startRecording} disabled={isRecording} />
            )}
            {isRecording && (
            <StopCircleIcon onClick={stopRecording} disabled={!isRecording} />
            )}
            {audioUrl && (
                <Container>
                    <audio src={audioUrl} controls />
                    <Button>届ける</Button>
                </Container>
            )}
        </Container>
    );
}

export default AudioTest