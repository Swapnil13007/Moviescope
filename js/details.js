const APIKey = "93ac677313f294316aab34b8d4ec8917";
const searchBox = document.querySelector(".searchBox__input");
const searchBtn = document.querySelector(".searchBox__btn");

searchBtn.addEventListener("click", (evt) => {
  sessionStorage.setItem("movieName", searchBox.value);
})

let movId = sessionStorage.getItem("movId");
let showId = sessionStorage.getItem("showId");
let apiUrl = "";

const setDetails = (data) => {
  const backImg = document.querySelector(".backdrop");
  const frontImg = document.querySelector(".frontImage__img");

  let backUrl = `https://image.tmdb.org/t/p/w1280${data.backdrop_path}`;
  let frontUrl = `https://image.tmdb.org/t/p/w342${data.poster_path}`;

  if (data.backdrop_path) {
    backImg.style.backgroundImage = `url(${backUrl})`;
  }
  else {
    backImg.style.backgroundImage = `url(${frontUrl})`;
  }

  frontImg.src = frontUrl;

  const name = document.querySelector(".name");
  const rating = document.querySelector(".rating");
  const overview = document.querySelector(".overview");

  if (data.name) {
    name.innerHTML = data.name;
  } else {
    name.innerHTML = data.title;
  }

  rating.innerHTML = `Rating: ${Math.round(data.vote_average * 10) / 10}/10`;

  overview.innerHTML = `${data.overview}`;

}

const getDetails = async (url) => {
  const res = await axios.get(url);
  console.log(res.data);
  setDetails(res.data);
}

if (movId) {
  apiUrl = `https://api.themoviedb.org/3/movie/${movId}?api_key=${APIKey}&language=en-US`;
  getDetails(apiUrl);
}
else if (showId) {
  apiUrl = `https://api.themoviedb.org/3/tv/${showId}?api_key=${APIKey}&language=en-US`;
  getDetails(apiUrl);
}
else {

}
