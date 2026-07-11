<script lang="ts">
    import {PUBLIC_API_URL} from "$env/static/public";
    import audio from "../assets/audio.png";

    let mediaRecorder: MediaRecorder | null = null;
    let audioChunks: Blob[] = [];

    let isRecording = $state(false);

    let { onResult } = $props();


    async function startRecording() {

        if (isRecording) {
            if (mediaRecorder) {
                mediaRecorder.stop();
            }
            return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });

        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {

            isRecording = false;
            const blob = new Blob(
                audioChunks,
                {
                    type: "audio/webm"
                }
            );

            // audioUrl = URL.createObjectURL(blob);
            uploadAudio(blob);
            // console.log(blob);
        };

        mediaRecorder.start();
        isRecording = true;
    }

    async function uploadAudio(blob: Blob) {
        const formData = new FormData();

        formData.append("audio", blob, "audio.webm");

        const response = await fetch(`${PUBLIC_API_URL}/api/transcribe`, {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        console.log(result);
        onResult(result);
    }
</script>
<div
    class="recorder"
    class:recording={isRecording}
    onclick={startRecording}
>
    <img src={audio} alt="audio" />
</div>
<style>
    .recorder {
        width: 35px;
        height: 35px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    .recorder img {
        width: 24px;
        height: 24px;
    }

    .recorder.recording {
        background: #d53434;
    }
</style>