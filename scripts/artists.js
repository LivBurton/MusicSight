const service = document.getElementById('service');
const tracksContainer = document.getElementById('tracks-container');
const btnSearch = document.getElementById('btn-search');
const search = document.getElementById('search');
const searchMessage = document.getElementById('search-message');
const albumContainer = document.getElementById('album-container');
const searched = document.getElementById('searched');
const searchedTitle = document.getElementById('searched-title');
const tracksSummary = document.getElementById('tracks-summary');
const tracksIndContainer = document.getElementById('tracks-ind-container');

// -------------------------------------------------------
// Search submitted - split and call function to fetch
// -------------------------------------------------------
let albumsInfo;

function searchSubmitted(e) {
  tracksContainer.style.display = 'none';
  e.preventDefault();
  if (!search.value) {
    searchMessage.innerText = 'Please type in a search';
  } else {
    searchMessage.innerText = '';
    const searchInput = search.value.split(' ').join('_');
    searchForArtist(searchInput);
  }
}

// -------------------------------------------------------
// Fetch search from API
// -------------------------------------------------------
async function searchForArtist(search) {
  const res = await fetch(
    `https://theaudiodb.com/api/v1/json/1/search.php?s=${search}`
  );
  const dataArtist = await res.json();
  if (dataArtist.artists !== null) {
    const artist = dataArtist.artists[0].idArtist;

    const res2 = await fetch(
      `https://theaudiodb.com/api/v1/json/1/album.php?i=${artist}`
    );

    const dataAlbums = await res2.json();
    albumsInfo = dataAlbums;

    displayAlbums(dataAlbums);
  } else {
    searchMessage.innerText = '0 results. Please try another search';
    searched.style.display = 'none';
    tracksContainer.style.display = 'none';
    albumContainer.innerHTML = '';
  }
}
// -------------------------------------------------------
// Display Albums
// -------------------------------------------------------
function displayAlbums(albums) {
  searched.style.display = 'block';

  searchedTitle.innerText = `Albums for "${search.value}"`;
  search.value = '';

  let displayData = '';
  albums.album.forEach((item, index) => {
    // console.log(item.strAlbumThumb);
    if (item.strAlbumThumb !== null && item.strAlbumThumb !== '') {
      displayData += `
        <div class="ind-album" data-album="${item.idAlbum}">
            <div class="artist-title">
                  <h2>${item.strArtist}</h2>
            </div>
            <img data-index="${index}" class="select-img" src="${item.strAlbumThumb}" alt="Image of the ${item.strArtist} album ${item.strAlbum}"/>
            <div class="album-title">
                <h2>${item.strAlbum}</h2>
            </div>
            <h3 class="year-released">${item.intYearReleased}</h3>
        </div>
  `;
    }
  });

  albumContainer.innerHTML = displayData;
}

// -------------------------------------------------------
// Fetch tracks from API for selected album
// -------------------------------------------------------
async function getTracks(e) {
  if (e.target.classList.contains('select-img')) {
    const albumID = e.target.parentElement.getAttribute('data-album');
    const index = e.target.getAttribute('data-index');
    const imgSrc = e.target.getAttribute('src');
    const res = await fetch(
      `https://theaudiodb.com/api/v1/json/1/track.php?m=${albumID}`
    );
    const dataTracks = await res.json();

    displayTracks(dataTracks, imgSrc, index);
  }
}
// -------------------------------------------------------
// Display track information
// -------------------------------------------------------
function displayTracks(tracks, imgSrc, index) {
  tracksContainer.style.display = 'flex';
  service.scrollIntoView();

  let displayTracks = '';
  let tracksInd = '';

  displayTracks = `
  
        <h2 class="album-name" id="album-name">${tracks.track[0].strArtist} - ${tracks.track[0].strAlbum}</h2>
        <div class="tracks-info" id="tracks-info">
          <img
            src="${imgSrc}"
            alt=""
          />
          <p class="album-description" id="album-description">
            ${albumsInfo.album[index].strDescriptionEN}
          </p>
        </div>      
    `;

  tracks.track.forEach(item => {
    tracksInd += `
         <div class="accordion">
           <p>${item.strTrack}</p>
           <div class="accordion-icons">`;
    if (item.strMusicVid !== null && item.strMusicVid !== '') {
      tracksInd += `
      <a href="${item.strMusicVid}" target="_blank"><i class="fab fa-youtube-square"></i></a>
      `;
    }

    if (item.strDescriptionEN !== null) {
      tracksInd += `
        <i class="fas fa-arrow-down"></i>      
      `;
    }

    tracksInd += `
            </div>
           </div>
      `;

    if (item.strDescriptionEN !== null) {
      tracksInd += `
          <div class="track-description">
            <p>
              ${item.strDescriptionEN}
            </p>
          </div>
`;
    }
  });

  tracksSummary.innerHTML = displayTracks;
  tracksIndContainer.innerHTML = tracksInd;
  // console.log(tracksIndContainer);
}

// -------------------------------------------------------
// Display track information on dropdown
// -------------------------------------------------------

// change the dropdown to show and rotate the arrow around
function showTrackInfo(e) {
  if (e.target.classList.contains('fa-arrow-down')) {
    const showing = document.querySelector('.show');
    const eContainer = e.target.parentElement.parentElement.nextElementSibling;
    // if no dropdown showing already
    if (showing === null) {
      eContainer.classList.add('show');
      e.target.classList.add('rotate');
    }
    // if click on the container already open
    else if (eContainer.classList.contains('show')) {
      eContainer.classList.remove('show');
      e.target.classList.remove('rotate');
    }
    // close container if click on another
    else if (showing !== null) {
      const rotated = document.querySelector('.rotate');
      rotated.classList.remove('rotate');

      showing.classList.remove('show');
      eContainer.classList.add('show');
      e.target.classList.add('rotate');
    }
  }
}

// -----------EVENT LISTENERS---------------------
btnSearch.addEventListener('click', searchSubmitted);
// Display track information on dropdown
tracksContainer.addEventListener('click', showTrackInfo);
// Fetch track information when user clicks on album
albumContainer.addEventListener('click', getTracks);
