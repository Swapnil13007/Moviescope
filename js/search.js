
const searchBox = document.querySelector(".searchBox__input");
const searchBtn = document.querySelector(".searchBox__btn");
const APIKey = "93ac677313f294316aab34b8d4ec8917";
history.scrollRestoration = 'manual';



window.onload = () => {
  let nameOfMovie = sessionStorage.getItem("movieName");
  // console.log(nameOfMovie);
  let API = `https://api.themoviedb.org/3/search/multi?api_key=${APIKey}&language=en-US&query=${nameOfMovie}&page=1&include_adult=false`;
  callAPI(API);
}

const setSearchMovies = (movies) => {
  const moviesContainer = document.querySelector(".results__container");

  movies.forEach(movie => {
    if (movie.poster_path) {
      let movImgs = `https://image.tmdb.org/t/p/w342${movie.poster_path}`;

      const newMovAnchor = document.createElement('a');
      const newMovDiv = document.createElement('div');
      const newMovImg = document.createElement('img');

      newMovImg.src = movImgs;

      newMovAnchor.href = "./details.html";
      newMovAnchor.appendChild(newMovImg);

      newMovDiv.classList.add("results__image");
      newMovDiv.id = movie.id;
      newMovDiv.attributes.value = movie.media_type;
      newMovDiv.appendChild(newMovAnchor);

      moviesContainer.appendChild(newMovDiv);
    }
  });
  const movImgs = document.querySelectorAll(".results__image");
  getMovDetails(movImgs);
}

const callAPI = async (api) => {
  try {
    const res = await axios.get(api);
    setSearchMovies(res.data.results);

  }
  catch (err) {
    console.log(err);
  }
}

const getMovDetails = (imgs) => {
  imgs.forEach((img) => {
    img.addEventListener("click", (evt) => {
      // evt.preventDefault();
      // console.dir(img.attributes.value);
      if (img.attributes.value === "movie") {
        sessionStorage.setItem("movId", evt.target.parentElement.parentElement.id);
        sessionStorage.removeItem("showId");
      } else {
        sessionStorage.setItem("showId", evt.target.parentElement.parentElement.id);
        sessionStorage.removeItem("movId");
      }
    })
  });
}

searchBtn.addEventListener("click", (evt) => {
  // evt.preventDefault();
  // console.dir(searchBox.value);
  sessionStorage.setItem("movieName", searchBox.value);
})