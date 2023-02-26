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
  const rating = document.querySelector(".rating__number");
  const overview = document.querySelector(".overview");

  if (data.name) {
    name.innerHTML = data.name;
  } else {
    name.innerHTML = data.title;
  }

  rating.innerHTML = `${Math.round(data.vote_average * 10) / 10} / 10`;

  overview.innerHTML = `${data.overview}`;

}

const setVideos = (videos) => {
  const trailersContainer = document.querySelector(".Trailer__container");
  const teasersContainer = document.querySelector(".Teaser__container");
  let trailersCount = 0;
  let teasersCount = 0;

  // console.log(videos);

  videos.forEach(video => {

    if (video.type == "Trailer") {
      trailersCount++;
      const videoURL = `https://www.youtube.com/embed/${video.key}`;
      const newVideo = document.createElement('iframe');
      newVideo.classList.add('video');
      newVideo.src = videoURL;
      newVideo.setAttribute("loading", "lazy");
      newVideo.setAttribute("frameborder", "0");
      newVideo.setAttribute("allow", "autoplay; fullscreen; encrypted-media; picture-in-picture;");
      trailersContainer.prepend(newVideo);
    }
    if (video.type == "Teaser" && teasersCount < 6) {
      teasersCount++;
      const videoURL = `https://www.youtube.com/embed/${video.key}`;
      const newVideo = document.createElement('iframe');
      newVideo.classList.add('video');
      newVideo.src = videoURL;
      newVideo.setAttribute("loading", "lazy");
      newVideo.setAttribute("frameborder", "0");
      newVideo.setAttribute("allow", "autoplay; fullscreen; encrypted-media; picture-in-picture;");
      teasersContainer.prepend(newVideo);
    }

  });

  if (trailersCount + teasersCount == 0) {
    const vidSection = document.querySelector(".videos")
    vidSection.style.display = "none";
  }
  else if (trailersCount == 0) {
    const trailerHeader = document.querySelector(".Trailers__header-box");
    trailerHeader.style.display = "none";
    trailersContainer.style.display = "none";
  }
  else if (teasersCount == 0) {
    const teaserHeader = document.querySelector(".Teasers__header-box");
    teaserHeader.style.display = "none";
    teasersContainer.style.display = "none";
  }
}

const getDetails = async (url) => {
  const res = await axios.get(url);
  console.log(res.data);
  setDetails(res.data);
  setVideos(res.data.videos.results);
}

if (movId) {
  apiUrl = `https://api.themoviedb.org/3/movie/${movId}?api_key=${APIKey}&language=en-US&append_to_response=videos`;
  getDetails(apiUrl);
}
else if (showId) {
  apiUrl = `https://api.themoviedb.org/3/tv/${showId}?api_key=${APIKey}&language=en-US&append_to_response=videos`;
  getDetails(apiUrl);
}
else {

}
