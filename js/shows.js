const APIKey = "93ac677313f294316aab34b8d4ec8917";
let pageNo = 1;
let totalPages = 10000;
history.scrollRestoration = 'manual';

const searchBox = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");

const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

const updateBtn = () => {
  if (pageNo === 1) {
    prevBtn.classList.add("disable-btn");
  } else if (pageNo === totalPages) {
    nextBtn.classList.add("disable-btn");
  } else {
    prevBtn.classList.remove("disable-btn");
    nextBtn.classList.remove("disable-btn");
  }
}
updateBtn();

const removeResults = () => {
  const results = document.querySelector(".results-container");
  results.innerHTML = "";
}

const setTrendingShows = (shows) => {
  const showsContainer = document.querySelector(".results-container");

  shows.forEach(show => {
    if (show.poster_path) {
      let showImgs = `https://image.tmdb.org/t/p/w342${show.poster_path}`;

      const newShowAnchor = document.createElement('a');
      const newShowDiv = document.createElement('div');

      newShowAnchor.href = "./details.html";
      newShowAnchor.appendChild(newShowDiv);

      newShowDiv.classList.add("result");
      newShowDiv.id = show.id;
      newShowDiv.style.backgroundImage = `url(${showImgs})`;
      showsContainer.appendChild(newShowAnchor);
    }
  });

  const showImgs = document.querySelectorAll(".result");
  getShowDetails(showImgs);
}
const getTrendingShows = async () => {
  if (pageNo > 0 && pageNo < totalPages) {
    let apiUrl = `https://api.themoviedb.org/3/trending/tv/week?api_key=${APIKey}&page=${pageNo}`;

    try {
      const showsRes = await axios.get(apiUrl);
      totalPages = (showsRes.data.total_pages - 1);
      setTrendingShows(showsRes.data.results);

    } catch (err) {
      console.log(err);
    }
  }
}
getTrendingShows();


const getShowDetails = (imgs) => {
  imgs.forEach((img) => {
    img.addEventListener("click", (evt) => {
      // evt.preventDefault();
      sessionStorage.setItem("showId", evt.target.id);
      sessionStorage.removeItem("movId");
    })
  });
}

nextBtn.addEventListener("click", (evt) => {
  pageNo++;
  if (pageNo <= totalPages) {
    removeResults();
    updateBtn();
    getTrendingShows();
    window.scrollTo(0, 0);
  }
})

prevBtn.addEventListener("click", (evt) => {
  pageNo--;
  if (pageNo > 0) {
    removeResults();
    updateBtn();
    getTrendingShows();
    window.scrollTo(0, 0);
  }
})

searchBtn.addEventListener("click", (evt) => {
  sessionStorage.setItem("movieName", searchBox.value);
})