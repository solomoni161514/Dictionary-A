const SW = document.querySelector('.switch');
const body = document.querySelector('body');
const moon_purple = document.querySelector('.svg2');
const moon_gray = document.querySelector('.svg1');

if (SW) {
    SW.onclick = function () {
        if (SW.classList.contains('active')) {
            SW.classList.remove('active');
            SW.classList.add('deactive');
            body.classList.remove('black');
            body.classList.add('white');
            moon_gray.classList.add("moon-gray");
            moon_purple.classList.remove("moon-purple");
        } else {
            SW.classList.remove('deactive');
            SW.classList.add('active');
            body.classList.remove('white');
            body.classList.add('black');
            moon_purple.classList.add("moon-purple");
            moon_gray.classList.remove("moon-gray");
        }
    };
}

const searchInput = document.querySelector('.search-input');
const wordTitle = document.querySelector('.word-title');
const meaningList = document.querySelector('.meaning-list');
const synonymList = document.querySelector('.synonym-list');
const wordType = document.querySelector('.word-type');
const sourceLink = document.querySelector('.source-link');
const pouseBtn = document.querySelector('.pouse-btn');
const mainElement = document.querySelector('main');
const footer = document.querySelector('footer');
const welcome_text = document.querySelector('.welcome');

mainElement.style.display = 'none';
footer.style.display = 'none';
welcome_text.style.display = 'block';

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const word = searchInput.value.trim();
        if (word) {
            searchWord(word);
            mainElement.style.display = 'block';
            footer.style.display = 'block';
            welcome_text.style.display = 'none';
        }
    }
});

function searchWord(word) {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Word not found.');
                } else if (response.status === 429) {
                    throw new Error('Too many requests.');
                } else {
                    throw new Error(`Error: ${response.statusText}`);
                }
            }
            return response.json();
        })
        .then(data => {
            const entry = data[0];
            wordTitle.textContent = entry.word || '';
            wordType.textContent = '';
            meaningList.innerHTML = '';
            synonymList.textContent = '';
            sourceLink.textContent = '';

            if (entry.meanings && entry.meanings.length > 0) {
                const firstMeaning = entry.meanings[0];
                wordType.textContent = firstMeaning.partOfSpeech || '';

                firstMeaning.definitions.forEach(def => {
                    const li = document.createElement('li');
                    li.className = 'meaning-item';
                    li.textContent = def.definition;
                    meaningList.appendChild(li);
                });

                let synonymsSet = new Set();
                entry.meanings.forEach(meaning => {
                    if (meaning.synonyms) {
                        meaning.synonyms.forEach(syn => synonymsSet.add(syn));
                    }
                    meaning.definitions.forEach(def => {
                        if (def.synonyms) {
                            def.synonyms.forEach(syn => synonymsSet.add(syn));
                        }
                    });
                });
                const synonyms = synonymsSet.size
                    ? Array.from(synonymsSet).join(', ')
                    : 'None';
                synonymList.textContent = synonyms;

                if (entry.sourceUrls && entry.sourceUrls.length > 0) {
                    sourceLink.textContent = entry.sourceUrls[0];
                    sourceLink.href = entry.sourceUrls[0];
                }
            } else {
                const li = document.createElement('li');
                li.className = 'meaning-item';
                li.textContent = 'No definitions found.';
                meaningList.appendChild(li);
            }

            let audio = null;
            if (entry.phonetics && entry.phonetics.length > 0) {
                const phonetic = entry.phonetics.find(p => p.audio);
                if (phonetic && phonetic.audio) {
                    audio = new Audio(phonetic.audio);
                }
            }

            if (pouseBtn) {
                pouseBtn.onclick = function () {
                    if (audio) {
                        audio.currentTime = 0;
                        audio.play();
                    }
                };
            }
        })
        .catch(error => {
            wordTitle.textContent = 'Word not found';
            wordType.textContent = '';
            meaningList.innerHTML = '';
            const li = document.createElement('li');
            li.className = 'meaning-item';
            li.textContent = error.message;
            meaningList.appendChild(li);
            synonymList.textContent = '';
            sourceLink.textContent = '';
        });
}
