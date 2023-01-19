const APIKey = "93ac677313f294316aab34b8d4ec8917";
let pageNo = 1;
let totalPages = 10000;
history.scrollRestoration = 'manual';

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

const setTrendingMovies = (movies) => {
  const moviesContainer = document.querySelector(".results-container");

  movies.forEach(movie => {
    if (movie.poster_path) {
      let movImgs = `https://image.tmdb.org/t/p/w342${movie.poster_path}`;

      const newMovDiv = document.createElement('div');
      newMovDiv.classList.add("result");
      newMovDiv.style.backgroundImage = `url(${movImgs})`;
      moviesContainer.appendChild(newMovDiv);
    }
  });
}

const getTrendingMovies = async () => {
  if (pageNo > 0 && pageNo <= totalPages) {
    let apiUrl = `https://api.themoviedb.org/3/trending/movie/week?api_key=${APIKey}&page=${pageNo}`;

    try {
      const moviesRes = await axios.get(apiUrl);
      totalPages = (moviesRes.data.total_pages - 1);
      setTrendingMovies(moviesRes.data.results);

    } catch (err) {
      console.log(err);
    }
  }
}
getTrendingMovies();


nextBtn.addEventListener("click", (evt) => {
  pageNo++;
  if (pageNo <= totalPages) {
    removeResults();
    updateBtn();
    getTrendingMovies();
    window.scrollTo(0, 0);
  }
})

prevBtn.addEventListener("click", (evt) => {
  pageNo--;
  if (pageNo > 0) {
    removeResults();
    updateBtn();
    getTrendingMovies();
    window.scrollTo(0, 0);
  }
})