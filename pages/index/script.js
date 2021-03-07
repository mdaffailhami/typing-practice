const elements = {
  typingContainer: document.querySelector("#typing-container"),
  typingTextBox: document.querySelector("#typing-container section #typing-text-box"),
  timer: document.querySelector("#typing-container section:first-of-type #timer"),
  reload: document.querySelector("#typing-container section:first-of-type #reload"),
  typingInput: document.querySelector("#typing-container section:nth-of-type(2) #typing-input"),
  languageButton: document.querySelector(
    "#typing-container section:nth-of-type(2) .dropdown button"
  ),
  languageMenu: document.querySelector("#typing-container section:nth-of-type(2) .dropdown ul li"),
};

const queryString = new URLSearchParams(window.location.search);

// Memanggil teks ke API
async function getWords() {
  const textAmount = 30;
  let language = queryString.get("language");

  return await fetch(`/text?language=${language}&amount=${textAmount}`)
    .then((res) => res.json())
    .then((res) => {
      const language = res.language;
      const words = res.words;

      elements.languageButton.innerHTML = language;
      if (language.toUpperCase() == "ENGLISH") {
        elements.languageMenu.innerHTML = `<a class="dropdown-item" href="/?language=indonesian">Indonesian</a>`;
      }

      // Hilangkan loader
      elements.typingTextBox.innerHTML = "";

      return words;
    })
    .catch((err) => console.warn(err));
}

// Memasukkan seluruh isi texts yg telah di call ke variabel
let texts = getWords();

function loadTexts() {
  // Menampilkan texts ke HTML
  texts.then((texts) => {
    for (let i = 0; i < texts.length; i++) {
      elements.typingTextBox.innerHTML += `<span>${texts[i]}</span> `;
    }

    // Menghandel style pada texts
    const textElements = document.querySelectorAll(
      "#typing-container section #typing-text-box span"
    );
    textElements[0].classList.add("bg-gray");
  });
}

// Start load texts
loadTexts();

// Menghandel inputan
let start = false;
let timer = 0;
let textIndex = 0;
elements.typingInput.addEventListener("keydown", (event) => {
  // Start timer
  if (!start) {
    start = true;

    setInterval(() => {
      timer++;

      // Menampilkan timer ke HTML
      elements.timer.innerHTML = timer;
    }, 1000);
  }

  texts.then((texts) => {
    const textElements = document.querySelectorAll(
      "#typing-container section #typing-text-box span"
    );

    const inputValue = elements.typingInput.value;

    // Ketika mencet spasi
    if (event.key == " ") {
      // Jika kata yg diketikkan itu benar
      if (inputValue === texts[textIndex]) {
        if (textIndex == texts.length - 1) {
          const charTyped = texts.join(" ").length + 1; // + 1 karena spasi di paling akhir juga termasuk

          const averageCPM = Math.floor((60 * charTyped) / timer);
          if (queryString.get("language").toUpperCase() == "ENGLISH") {
            alert(
              `Total characters = ${charTyped}\nTotal time          = ${timer} second\nAverage             = ${averageCPM} characters per minute`
            );
          } else {
            alert(
              `Total karakter = ${charTyped}\nTotal waktu     = ${timer} detik\nRata-rata        = ${averageCPM} karakter per menit`
            );
          }
          location.reload();
        } else {
          // Menghandel style pada texts
          textElements[textIndex + 1].classList.add("bg-gray");
        }
        // Menghandel style pada texts
        textElements[textIndex].classList.remove("bg-gray", "bg-danger");
        textElements[textIndex].classList.add("btn-success");

        // Mengincrement
        textIndex++;

        // Mereset inputan
        setTimeout(() => {
          elements.typingInput.value = "";
        });
      }
    }
  });
});

elements.typingInput.addEventListener("keyup", (event) => {
  texts.then((texts) => {
    const textElements = document.querySelectorAll(
      "#typing-container section #typing-text-box span"
    );

    const inputValue = elements.typingInput.value;

    const currentText = texts[textIndex];

    for (let i = 0; i < inputValue.length; i++) {
      // Jika yg diketikkan itu salah
      if (inputValue[i] != currentText[i]) {
        textElements[textIndex].classList.add("bg-danger");
        break;
      }
      // Jika yg diketikkan itu benar
      else {
        textElements[textIndex].classList.remove("bg-danger");
      }
    }
  });
});

elements.reload.addEventListener("click", () => {
  // start = false;
  // timer = 0;
  // textIndex = 0;
  // texts = getWords();
  // clearInterval(timeInterval);
  // loadTexts();
  location.reload();
});
