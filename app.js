
const APIKey = "93ac677313f294316aab34b8d4ec8917";
let activeImgNo = 0;
let backdropImagesArr = [];
let slideMovieNames = [];
let slideMovieOverview = [];

const searchBox = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");
const resultImg = document.getElementsByClassName("trending-movies");
const backgroundSlide = document.querySelector(".back-images-container");
const imgLeft = document.getElementById("img-left");
const imgRight = document.getElementById("img-right");


const placeSlideImages = (data) => {
  const slideContainer = document.querySelector(".front-images-container");
  data.forEach(movie => {
    let frontImgUrl = `https://image.tmdb.org/t/p/w342${movie.poster_path}`;

    backdropImagesArr.push(`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`);
    slideMovieNames.push(movie.title);
    slideMovieOverview.push(movie.overview);
    // console.log(movie);
    // sessionStorage.setItem("key", "value");

    const newImg = document.createElement('div');
    newImg.classList.add("front-image");
    newImg.style.backgroundImage = `url(${frontImgUrl})`;
    slideContainer.appendChild(newImg);
    // console.dir(newImg);
  });
}
const setSlides = (data) => {
  const slides = document.querySelectorAll(".front-image");
  const title = document.querySelector(".slide-movie-title");
  const overview = document.querySelector(".slide-movie-overview");

  slides[activeImgNo].classList.add("active");
  backgroundSlide.style.backgroundImage = `url(${backdropImagesArr[activeImgNo]})`;
  title.innerHTML = slideMovieNames[activeImgNo];
  overview.innerHTML = slideMovieOverview[activeImgNo];
  // console.dir(slides);
}
const getSlideImages = async () => {
  let APIUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${APIKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`;
  try {
    const res = await axios.get(APIUrl);
    // console.log(res.data.results);
    placeSlideImages(res.data.results);
    setSlides(res.data.results);
  }
  catch (err) {
    console.log(err);
  }
}
getSlideImages();

const moveSlideToRight = () => {
  const slides = document.querySelectorAll(".front-image");
  slides[activeImgNo].classList.remove("active");
  activeImgNo++;
  if (activeImgNo > slides.length - 1) {
    activeImgNo = 0;
  }
  setSlides();
}
const moveSlideToLeft = () => {
  const slides = document.querySelectorAll(".front-image");
  slides[activeImgNo].classList.remove("active");
  activeImgNo--;
  if (activeImgNo < 0) {
    activeImgNo = slides.length - 1;
  }
  setSlides();
}
const autoChangeSlide = () => {
  setInterval(moveSlideToRight, 3000);
}
autoChangeSlide();


const setTrending = (movies, shows) => {
  const moviesContainer = document.querySelector(".trending-movies");
  const showsContainer = document.querySelector(".trending-series");

  for (let i = 0; i < 5; i++) {
    let movImgs = `https://image.tmdb.org/t/p/w342${movies[i].poster_path}`;
    let showImgs = `https://image.tmdb.org/t/p/w342${shows[i].poster_path}`;

    const newMovAnchor = document.createElement('a');
    const newMovDiv = document.createElement('div');

    newMovAnchor.href = "./pages/details.html";
    newMovAnchor.appendChild(newMovDiv);

    newMovDiv.classList.add("trending-movies_img");
    newMovDiv.id = movies[i].id;
    newMovDiv.style.backgroundImage = `url(${movImgs})`;
    moviesContainer.appendChild(newMovAnchor);

    const newShowAnchor = document.createElement('a');
    const newShowDiv = document.createElement('div');

    newShowAnchor.href = "./pages/details.html";
    newShowAnchor.appendChild(newShowDiv);

    newShowDiv.classList.add("trending-series_img");
    newShowDiv.id = shows[i].id;
    newShowDiv.style.backgroundImage = `url(${showImgs})`;
    showsContainer.appendChild(newShowAnchor);
  }
  const movImgs = document.querySelectorAll(".trending-movies_img");
  const showImgs = document.querySelectorAll(".trending-series_img");
  getMovDetails(movImgs);
  getShowDetails(showImgs);
}
const getHomeMoviesShows = async () => {
  let movieApiUrl = `https://api.themoviedb.org/3/trending/movie/week?api_key=${APIKey}`;
  let showsApiUrl = `https://api.themoviedb.org/3/trending/tv/week?api_key=${APIKey}`;

  try {
    const moviesRes = await axios.get(movieApiUrl);
    const showsRes = await axios.get(showsApiUrl);
    // console.log(moviesRes.data.results);
    // console.log(showsRes.data.results);

    setTrending(moviesRes.data.results, showsRes.data.results);
  } catch (err) {
    console.log(err);
  }

}
getHomeMoviesShows();

imgLeft.addEventListener("click", () => {
  moveSlideToLeft();
})
imgRight.addEventListener("click", () => {
  moveSlideToRight();
})


const getMovDetails = (imgs) => {
  imgs.forEach((img) => {
    img.addEventListener("click", (evt) => {
      // evt.preventDefault();
      sessionStorage.setItem("movId", evt.target.id);
      sessionStorage.removeItem("showId");
    })
  });
}

const getShowDetails = (imgs) => {
  imgs.forEach(img => {
    img.addEventListener("click", (evt) => {
      // evt.preventDefault();
      sessionStorage.setItem("showId", evt.target.id);
      sessionStorage.removeItem("movId");
    })
  });
}


searchBtn.addEventListener("click", (evt) => {
  sessionStorage.setItem("movieName", searchBox.value);
})