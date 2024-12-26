const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
recognition.interimResults = false;

const statusElement = document.getElementById('status');
const playerElement = document.getElementById('player');

// Text-to-Speech function
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
}

// Function to search and play a YouTube video
async function playSong(songName) {
    statusElement.textContent = `Searching for "${songName}" on YouTube...`;

    // Fetch search results from YouTube
    const response = await fetch(`https://www.youtube.com/results?search_query=${encodeURIComponent(songName)}`);
    const text = await response.text();

    // Extract the first video ID using regex
    const videoIdMatch = text.match(/"videoId":"(.*?)"/);
    if (videoIdMatch && videoIdMatch[1]) {
        const videoId = videoIdMatch[1];

        // Update the player to embed the YouTube video
        playerElement.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" allow="autoplay" allowfullscreen></iframe>`;
        speak(`Ok Darling, I am playing your commanded song for you.`);
        statusElement.textContent = `Playing: "${songName}"`;
    } else {
        speak(`Sorry Darling, I couldn't find the song "${songName}" on YouTube.`);
        statusElement.textContent = `Error: Could not find the song "${songName}".`;
    }
}

// Function to handle custom audio commands
function playCustomAudio(audioFileName) {
    customAudioElement.src = `audio/${audioFileName}`; // Ensure the file is in an "audio" folder
    customAudioElement.play();
    customAudioElement.style.display = 'block';

    speak(`ok`);
    statusElement.textContent = `Playing custom audio: "${audioFileName}"`;
}


// Handle default commands
function handleDefaultCommands(transcript) {
    if (transcript.includes('hello')) {
        speak('Hello! Darling. How can I assist you today?');
        statusElement.textContent = 'Zerox: Hello! How can I assist you today?';
    } else if (transcript.includes('how are you')) {
        speak('I am very well my darling, How about you?');
        statusElement.textContent = 'Zerox: I am just a program, but I am functioning perfectly.';
    } else if (transcript.includes('your name')) {
        speak('My name is Zerox, your forever lover.');
        statusElement.textContent = 'Zerox: My name is Zerox, your voice assistant.';
    } else if (transcript.includes('say me three magical words')) {
        playCustomAudio('voices/i-love-you.mp3'); // Replace with the actual file name
    } else {
        speak('Sorry darling, I did not understand the command. Please try again.');
        statusElement.textContent = 'Zerox: Sorry, I did not understand the command.';
    } 
}

// Handle voice recognition
recognition.onstart = () => {
    statusElement.textContent = 'Listening... Please say a command.';
};

recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    statusElement.textContent = `You said: "${transcript}"`;

    if (transcript.startsWith('play')) {
        const songName = transcript.replace('play', '').trim();
        if (songName) {
            playSong(songName);
        } else {
            speak('Please specify the name of the song after saying play.');
        }
    } else {
        handleDefaultCommands(transcript);
    }
};

recognition.onerror = (event) => {
    statusElement.textContent = `Error: ${event.error}`;
};

recognition.onend = () => {
    statusElement.textContent = 'Stopped listening. Click the button to start again.';
};

// Start listening on button click
document.getElementById('start').addEventListener('click', () => {
    recognition.start();
});
