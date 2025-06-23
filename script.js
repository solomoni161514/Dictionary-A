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
const errorDiv = document.querySelector('.errorDiv');
meaningList.innerHTML = ''
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const word = searchInput.value.trim();
        if (word) {
            searchWord(word);
            mainElement.style.display = 'block';
            footer.style.display = 'block';
            welcome_text.style.display = 'none';
            errorDiv.style.display = 'none';
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
            meaningList.innerHTML = '';
            synonymList.textContent = '';
            sourceLink.textContent = '';
            wordType.textContent = '';

            const allMeanings = entry.meanings;
            let synonymsSet = new Set();

            if (allMeanings && allMeanings.length > 0) {
                allMeanings.forEach(meaning => {
                    const typeHeader = document.createElement('h4');
                    typeHeader.textContent = meaning.partOfSpeech;
                    meaningList.appendChild(typeHeader);

                    meaning.definitions.forEach(def => {
                        const li = document.createElement('li');
                        li.className = 'meaning-item';
                        li.textContent = def.definition;
                        meaningList.appendChild(li);

                        // Optionally, display example if available
                        if (def.example) {
                            const p = document.createElement('p');
                            p.className = 'example';
                            p.textContent = `Example: ${def.example}`;
                            p.style.color = 'rgb(197, 2, 197)';
                            p.style.opacity = '0.6';
                            meaningList.appendChild(p);
                        }                   


                        if (def.synonyms) {
                            def.synonyms.forEach(syn => synonymsSet.add(syn));
                        }
                    });

                    if (meaning.synonyms) {
                        meaning.synonyms.forEach(syn => synonymsSet.add(syn));
                    }
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

            // Show hr if found
            const hr = document.querySelector('hr');
            if (hr) {
                hr.style.display = '';
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
            const hr = document.querySelector('hr');
            const meaning = document.querySelector('.section-title')
            const meaningItem = document.querySelector('.meaning-item')
            const syn = document.querySelector('.synonyms')
            const sourceTitlen = document.querySelector('.source-title')
            const svg = document.querySelector('svg')
            
            
            if (mainElement) {
                mainElement.style.display = 'none';
            }
            if (footer) {
                footer.style.display = 'none';
            }
            if (errorDiv) {
                errorDiv.style.display = 'flex';
            }

        });
        
}