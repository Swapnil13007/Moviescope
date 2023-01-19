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

    const newMovDiv = document.createElement('div');
    newMovDiv.classList.add("trending-movies_img");
    newMovDiv.style.backgroundImage = `url(${movImgs})`;
    moviesContainer.appendChild(newMovDiv);

    const newShowDiv = document.createElement('div');
    newShowDiv.classList.add("trending-series_img");
    newShowDiv.style.backgroundImage = `url(${showImgs})`;
    showsContainer.appendChild(newShowDiv);

  }
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

// console.log(backdropImagesArr);
// console.log(slideMovieNames);
// console.log(slideMovieOverview);

const addResult = (data) => {
  // console.log(typeof (data.Poster))
  // console.log(resultImg[0].append)
  resultImg[0].innerHTML += `<div class="main-result_img" style="background-image: url('${data.Poster}');"></div>`
}
const callAPI = async (api) => {
  try {
    const res = await axios.get(api);
    // console.log(res.data.results);
    // addResult(res.data);
  }
  catch (err) {
    console.log(err);
  }
}
searchBtn.addEventListener("click", (evt) => {
  evt.preventDefault();
  // console.dir(searchBox.value);
  let API = `https://api.themoviedb.org/3/discover/movie?api_key=${APIKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`;
  callAPI(API);
})