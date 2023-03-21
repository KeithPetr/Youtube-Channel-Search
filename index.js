const apiKey = "AIzaSyCQeLbFs2ybYQQHH_wGKspa2QH-eyBPvGo";
const endpoint = "https://www.googleapis.com/youtube/v3/search";
const get = (id) => document.getElementById(id);
const searchOptions = get("channel-menu");
const searchInput = get("search-input");
const searchBtn = get("search-btn");
const searchResults = get("search-results");

let dataArray = [];

function search() {
  const input = searchInput.value.trim();
  if (input) {
    console.log(input);
    console.log(searchOptions.value);
    callApi(input);
    searchInput.value = "";
    searchInput.blur();
  } else {
    searchInput.focus();
  }
}

function callApi(input) {
  dataArray = [];
  fetch(
    `${endpoint}?key=${apiKey}&channelId=${searchOptions.value}
    &q=${input}&part=snippet&type=video&maxResults=15`
  )
    .then((res) => {
        if(!res.ok) {
            throw Error("Something went wrong")
        }
        return res.json()
    })
    .then((data) => {
      data.items.map((item) => dataArray.push({ ...item.id, ...item.snippet }));
      console.log(dataArray);
      if (dataArray.length) {
        renderResults(dataArray);
      } else {
        throw Error("Search terms produced no results")
      }
    })
    .catch((error) => (get("search-results").innerHTML = error));
}

function renderResults(dataArray) {
  const html = dataArray
    .map((item) => {
      const date = new Date(item.publishTime).toLocaleString().split(",")[0];
      return `
            <div class="video">
                <a href="https://www.youtube.com/watch?v=${item.videoId}" target="_blank">
                    <img class="image" src="${item.thumbnails.high.url}"/>
                    <p class="title">${item.title}</p>
                    <div class="row">
                        <p class="channel">${item.channelTitle}</p>
                        <p class="date">${date}</p>
                    </div>
                    <p class="description">${item.description}</p>
                </a>
            </div>
        `;
    })
    .join("");
  searchResults.innerHTML = html;
}

searchBtn.addEventListener("click", search);
searchInput.addEventListener("keydown", (e) => {
    if (e.target === searchInput && e.keyCode === 13) {
        search();
    }
});