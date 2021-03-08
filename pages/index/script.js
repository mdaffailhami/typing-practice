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
  const wordAmount = 25;
  let language = queryString.get("language");

  // Styling language button
  if (
    language == null ||
    language.toUpperCase() == "INDONESIAN" ||
    language.toUpperCase() == "INDONESIA"
  ) {
    elements.languageButton.innerHTML = "Indonesian";
    elements.languageMenu.innerHTML = `<a class="dropdown-item" href="/?language=english">English</a>`;
  }

  return await fetch(`/word?language=${language}&amount=${wordAmount}`)
    .then((res) => res.json())
    .then((res) => {
      const words = res.words;

      // Hilangkan loader
      elements.typingTextBox.innerHTML = "";

      return words;
    })
    .catch((err) => {
      if (
        language == null ||
        language.toUpperCase() == "INDONESIAN" ||
        language.toUpperCase() == "INDONESIA"
      ) {
        // Jika bahasa Indonesia
        elements.typingTextBox.innerHTML = '<span class="text-danger">Gagal memuat teks!</span>';
      } else {
        // Jika bahasa Inggris
        elements.typingTextBox.innerHTML = '<span class="text-danger">Failed to load text!</span>';
      }
      console.warn(err);
    });
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
elements.typingInput.addEventListener("keyup", (event) => {
  // Start timer
  if (!start) {
    start = true;

    setInterval(() => {
      timer++;

      // Menampilkan timer ke HTML
      elements.timer.innerHTML = timer;
    }, 1000);
  }

  // Menghandle inputan
  texts.then((texts) => {
    const textElements = document.querySelectorAll(
      "#typing-container section #typing-text-box span"
    );

    const inputValue = elements.typingInput.value;

    const currentText = texts[textIndex];

    for (let i = 0; i < inputValue.length; i++) {
      if (inputValue[i] != currentText[i]) {
        // Jika yg diketikkan itu salah
        textElements[textIndex].classList.add("bg-danger");
      } else {
        // Jika yg diketikkan itu benar
        textElements[textIndex].classList.remove("bg-danger");
      }
    }

    if (inputValue.includes(" ") && inputValue == currentText + " ") {
      if (textIndex == texts.length - 1) {
        const charTyped = texts.join(" ").length + 1; // + 1 karena spasi di paling akhir juga termasuk

        // Hasil akhir
        const averageCPM = Math.floor((60 * charTyped) / timer);
        if (
          queryString.get("language") == null ||
          queryString.get("language").toUpperCase() == "INDONESIAN" ||
          queryString.get("language").toUpperCase() == "INDONESIA"
        ) {
          // Jika bahasa Indonesia
          alert(
            `Total karakter = ${charTyped}\nTotal waktu     = ${timer} detik\nRata-rata        = ${averageCPM} karakter per menit`
          );
        } else {
          // Jika bahasa Inggris
          alert(
            `Total characters = ${charTyped}\nTotal time          = ${timer} second\nAverage             = ${averageCPM} characters per minute`
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
