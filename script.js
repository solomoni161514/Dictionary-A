const SW = document.querySelector('.switch');
const body = document.querySelector('body');

if (SW) {
    SW.onclick = function() {
        if (SW.classList.contains('active')) {
            SW.classList.remove('active');
            SW.classList.add('deactive');
            body.classList.remove('black');
            body.classList.add('white');
        } else {
            SW.classList.remove('deactive');
            SW.classList.add('active');
            body.classList.remove('white');
            body.classList.add('black');
        }
    };
}

const searchInput = document.querySelector('.search-input');
const wordTitle = document.querySelector('.word-title');
const meaningList = document.querySelector('.meaning-list');
const synonymList = document.querySelector('.synonym-list');
const wordType = document.querySelector('.word-type');
const sourceLink = document.querySelector('.source-link');

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchWord(searchInput.value.trim());
    }
});

function searchWord(word) {
    if (!word) return;
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Word not found. Please check your spelling or try another word.');
                } else if (response.status === 429) {
                    throw new Error('Too many requests. Please wait and try again.');
                } else {
                    throw new Error(`An error occurred: ${response.statusText} (Status: ${response.status})`);
                }
            }
            return response.json();
        })
        .then(data => {
            const entry = data[0];
            wordTitle.textContent = entry.word || '';

            if (entry.meanings && entry.meanings.length > 0) {
                const firstMeaning = entry.meanings[0];
                wordType.textContent = firstMeaning.partOfSpeech || '';

                while (meaningList.firstChild) {
                    meaningList.removeChild(meaningList.firstChild);
                }

                firstMeaning.definitions.forEach(def => {
                    const li = document.createElement('li');
                    li.className = 'meaning-item';
                    li.textContent = def.definition;
                    meaningList.appendChild(li);

                   
                });

                let synonymsSet = new Set();
                entry.meanings.forEach(meaning => {
                    if (meaning.synonyms && meaning.synonyms.length) {
                        meaning.synonyms.forEach(syn => synonymsSet.add(syn));
                    }
                    if (meaning.definitions && meaning.definitions.length) {
                        meaning.definitions.forEach(def => {
                            if (def.synonyms && def.synonyms.length) {
                                def.synonyms.forEach(syn => synonymsSet.add(syn));
                            }
                        });
                    }
                });
                const synonyms = synonymsSet.size
                    ? Array.from(synonymsSet).join(', ')
                    : 'None';
                synonymList.textContent = synonyms;

                sourceLink.textContent = entry.sourceUrls ? entry.sourceUrls[0] : '';
            } else {
                wordType.textContent = '';
                while (meaningList.firstChild) {
                    meaningList.removeChild(meaningList.firstChild);
                }
                const li = document.createElement('li');
                li.className = 'meaning-item';
                li.textContent = 'No definitions found.';
                meaningList.appendChild(li);
                synonymList.textContent = '';
                sourceLink.textContent = '';
            }
        })
        .catch(() => {
            wordTitle.textContent = 'Word not found';
            wordType.textContent = '';
            while (meaningList.firstChild) {
                meaningList.removeChild(meaningList.firstChild);
            }
            const li = document.createElement('li');
            li.className = 'meaning-item';
            li.textContent = 'No definitions found.';
            meaningList.appendChild(li);
            synonymList.textContent = '';
            sourceLink.textContent = '';
        });
}
