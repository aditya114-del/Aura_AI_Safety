const sosButton = document.getElementById("sosButton");
const voiceButton = document.getElementById("voiceButton");
const voiceResult = document.getElementById("voiceResult");
const fakeCallButton = document.getElementById("fakeCallButton");

const modal = document.getElementById("modal");
const modalIcon = document.getElementById("modalIcon");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");
const closeModal = document.getElementById("closeModal");

function showModal(icon, title, message) {
modalIcon.textContent = icon;
modalTitle.textContent = title;
modalText.textContent = message;
modal.hidden = false;
closeModal.focus();
}

function hideModal() {
modal.hidden = true;
}

sosButton.addEventListener("click", () => {
showModal(
"🆘",
"SOS Demo Activated",
"This is a demonstration only. No emergency alert was sent. In a real emergency in India, call 112."
);
});

closeModal.addEventListener("click", hideModal);

modal.addEventListener("click", (event) => {
if (event.target === modal) hideModal();
});

document.addEventListener("keydown", (event) => {
if (event.key === "Escape") hideModal();
});

fakeCallButton.addEventListener("click", () => {
showModal(
"📞",
"Incoming Call",
"Simulated incoming call: Unknown Caller. This is only a visual demo; no actual call is being made."
);
});

let recognition = null;
let listening = false;

const SpeechRecognition =
window.SpeechRecognition ||
window.webkitSpeechRecognition;

if (SpeechRecognition) {
recognition = new SpeechRecognition();
recognition.lang = "en-IN";
recognition.continuous = true;
recognition.interimResults = false;


recognition.onresult = (event) => {
    for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
    ) {
        if (!event.results[i].isFinal) continue;

        const transcript =
            event.results[i][0].transcript.trim();

        voiceResult.textContent = "Heard: " + transcript;

        if (/\bblueberry\b/i.test(transcript)) {
            listening = false;
            recognition.stop();

            showModal(
                "🔔",
                "Keyword Detected",
                'The secret keyword "Blueberry" was detected. This demo does not contact emergency services.'
            );

            voiceButton.textContent = "Start Listening";
            voiceResult.textContent =
                "Keyword detected. Listening stopped.";
            return;
        }
    }
};

recognition.onerror = (event) => {
    listening = false;
    voiceButton.textContent = "Start Listening";
    voiceResult.textContent =
        "Voice recognition error: " + event.error;
};

recognition.onend = () => {
    if (listening) {
        try {
            recognition.start();
        } catch (error) {
            listening = false;
            voiceButton.textContent = "Start Listening";
        }
    }
};

voiceButton.addEventListener("click", () => {
    if (listening) {
        listening = false;
        recognition.stop();
        voiceButton.textContent = "Start Listening";
        voiceResult.textContent = "Voice activation is off.";
        return;
    }

    listening = true;
    voiceButton.textContent = "Stop Listening";
    voiceResult.textContent =
        'Listening for "Blueberry"...';

    try {
        recognition.start();
    } catch (error) {
        listening = false;
        voiceButton.textContent = "Start Listening";
        voiceResult.textContent =
            "Could not start listening. Please try again.";
    }
});


} else {
voiceButton.disabled = true;
voiceResult.textContent =
"Speech recognition is not supported in this browser. Try an updated Chrome browser.";
}




async function testBackend() {
    try {
        const response = await fetch(
            "http://127.0.0.1:5000/"
        );

        if (!response.ok) {
            throw new Error("HTTP error: " + response.status);
        }

        const data = await response.json();

        console.log("Backend connected:", data);

        alert("Aura Backend Connected Successfully!");

    } catch (error) {
        console.error("Backend connection failed:", error);

        alert("Backend connect nahi hua. Console check karo.");
    }
}

