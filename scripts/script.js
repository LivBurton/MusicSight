const displayAPI = document.getElementById('display-api');
const btnSearch = document.getElementById('btn-search');

// https://theaudiodb.com/api/v1/json/1/searchalbum.php?s=${search}
// https://theaudiodb.com/api/v1/json/1/search.php?s=coldplay

const search = 'muse';
async function testAPI(search) {
  const res = await fetch(
    `https://theaudiodb.com/api/v1/json/1/searchalbum.php?s=${search}`
  );
  const data = await res.json();
  searchedData = data;
  console.log(data);
  showData(data);
  // displayAPI.innerHTML = `${search}`;
}

// function testAPI(search) {
//   console.log(search);
// }

// displayAPI.innerHTML = `${search}`;

function showData(data) {
  console.log(data.album[0].strAlbumThumb);
  displayAPI.innerHTML = `
    <img src ="${data.album[0].strAlbumThumb}">
  `;
}

btnSearch.addEventListener('click', e => testAPI(search));
