const tracksContainer = document.getElementById('tracks-ind-container');
const btnSearch = document.getElementById('btn-search');
const inputSearch = document.getElementById('search');
const searchMessage = document.getElementById('search-message');
const otherResults = document.getElementById('other-results');

// -------------------------------------------------------
// Button click to submit search
// -------------------------------------------------------
function btnLyrics(e) {
  e.preventDefault();
  const searchEntered = inputSearch.value.trim();

  if (!searchEntered) {
    searchMessage.innerText = 'Please type in a search.';
  } else {
    searchMessage.innerText = `You searched for "${inputSearch.value}"`;
    searchLyrics(searchEntered);
  }
  inputSearch.value = '';
}

// -------------------------------------------------------
// Get lyrics from search
// -------------------------------------------------------
async function searchLyrics(search) {
  const res = await fetch(`https://api.lyrics.ovh/suggest/${search}`);
  const data = await res.json();

  displayInfo(data);
}

// -------------------------------------------------------
// Display data/track information from fetch
// -------------------------------------------------------
function displayInfo(data) {
  let show = '';
  otherResults.innerHTML = '';
  data.data.forEach(song => {
    show += `
    <div class="ind-accordion">
      <div class="accordion">
        <div class="titles">
          <h3>${song.artist.name}</h3>
          <p>${song.title}</p>
        </div>
        <div class="accordion-icons">
          <button class="btn-lyrics" data-artist="${song.artist.name}" data-song="${song.title}">Lyrics</button>
        </div>      
      </div>
      <div class="track-description"></div>
    </div>
    `;
  });

  tracksContainer.innerHTML = show;

  // If more than 15 on search, create button for each if present. NB data.next for love is: next: "http://api.deezer.com/search?limit=15&q=love&index=15")
  if (data.prev) {
    otherResults.innerHTML += `<button id="btn-prev" class="btn-other-results" onclick="getOtherSongs('${data.prev}')">Prev</button>`;
  }

  if (data.next) {
    otherResults.innerHTML += `<button id="btn-next" class="btn-other-results" onclick="getOtherSongs('${data.next}')">Next</button>`;
  }
}

// -------------------------------------------------------
// Get other songs when clicked next or prev buttons
// -------------------------------------------------------
async function getOtherSongs(otherData) {
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${otherData}`);

  const data = await res.json();

  displayInfo(data);
  const offset = 95;
  window.scroll({
    top: tracksContainer.offsetTop - offset,
    left: 0,
    behavior: 'smooth',
  });
}
// -------------------------------------------------------
// Get the artist and song details for getting lyrics
// -------------------------------------------------------
function sendListDetails(e) {
  if (e.target.classList.contains('btn-lyrics')) {
    const artist = e.target.getAttribute('data-artist');
    const song = e.target.getAttribute('data-song');

    getLyrics(artist, song, e.target);
  }
}

// -------------------------------------------------------
// Get lyrics
// -------------------------------------------------------
async function getLyrics(artist, song, btn) {
  const res = await fetch(`https://api.lyrics.ovh/v1/${artist}/${song}`);
  const data = await res.json();

  // regular expression - checking here for return and new line, return or new line. Added global flag to check entirity. Replaced with line break.
  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

  const words = btn.parentElement.parentElement.nextElementSibling;

  words.innerHTML = `
    <h3>${artist}</h3>
    <h4>${song}</h4>
    <p>${lyrics}</p>
  `;

  const offset = 95;
  window.scroll({ top: btn.offsetTop - offset, left: 0, behavior: 'smooth' });
}

// -------------------------------------------------------
// Display track information on dropdown
// -------------------------------------------------------

// change the dropdown to show the arrow
function showTrackInfo(e) {
  if (e.target.classList.contains('btn-lyrics')) {
    const showing = document.querySelector('.show');
    const eContainer = e.target.parentElement.parentElement.nextElementSibling;
    // if no dropdown showing already
    if (showing === null) {
      eContainer.classList.add('show');
      addClose(e.target, 'close');
    }
    // if click on the container already open
    else if (eContainer.classList.contains('show')) {
      eContainer.classList.remove('show');

      addClose(e.target, 'open');
    }
    // close container if click on another
    else if (showing !== null) {
      const closeAdded = document.querySelector('.close');
      closeAdded.classList.remove('close');
      closeAdded.innerText = 'Lyrics';

      showing.classList.remove('show');
      eContainer.classList.add('show');

      addClose(e.target, 'close');
    }
  }
}

// ---------ADD CLOSE TO BUTTON------------------
function addClose(e, text) {
  e.innerHTML = '';
  if (text === 'close') {
    e.innerHTML = '&times;';
    e.classList.add('close');
  } else {
    e.innerText = 'Lyrics';
    e.classList.remove('close');
  }
}

// -------------EVENT LISTENERS-------------------
// search
btnSearch.addEventListener('click', btnLyrics);

// Display track information on dropdown
tracksContainer.addEventListener('click', showTrackInfo);

// Get the lyrics
tracksContainer.addEventListener('click', sendListDetails);
