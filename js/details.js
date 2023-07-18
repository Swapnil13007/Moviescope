const APIKey = "93ac677313f294316aab34b8d4ec8917";
const YtKey = "AIzaSyBI5os32tm3KM6tMxMloDrTXOfNbWJcIfc";
const searchBox = document.querySelector(".searchBox__input");
const searchBtn = document.querySelector(".searchBox__btn");
const play = document.querySelector(".btn__play");

let movId = sessionStorage.getItem("movId");
let showId = sessionStorage.getItem("showId");
let apiUrl = "";

searchBtn.addEventListener("click", (evt) => {
  sessionStorage.setItem("movieName", searchBox.value);
});

play.addEventListener("click", (evt) => {
  if (movId) {
    localStorage.removeItem("showId");
    localStorage.setItem("movId", movId);
  } else {
    localStorage.removeItem("movId");
    localStorage.setItem("showId", showId);
  }
});

const setDetails = (data) => {
  const backImg = document.querySelector(".backdrop");
  const frontImg = document.querySelector(".frontImage__img");

  let backUrl = `https://image.tmdb.org/t/p/w1280${data.backdrop_path}`;
  let frontUrl = `https://image.tmdb.org/t/p/w342${data.poster_path}`;

  if (data.backdrop_path) {
    backImg.style.backgroundImage = `url(${backUrl})`;
  } else {
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

  // play.href = `${playUrl}${data.id}&color=4e1d77`;
};

const checkRestricted = async (videoId) => {
  let url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${YtKey}&part=snippet,contentDetails,status`;

  let sta;

  const res = await axios.get(url);
  if (res.data.items[0].contentDetails.regionRestriction) {
    sta = true;
  } else {
    sta = false;
  }

  return sta;
};

const setVideos = (videos) => {
  const trailersContainer = document.querySelector(".Trailer__container");
  const teasersContainer = document.querySelector(".Teaser__container");
  let trailersCount = 0;
  let teasersCount = 0;

  // console.log(videos);

  videos.forEach((video) => {
    if (video.type == "Trailer" && trailersCount < 2) {
      trailersCount++;

      checkRestricted(video.key).then((res) => {
        if (!res) {
          const videoURL = `https://www.youtube.com/embed/${video.key}`;
          const newVideo = document.createElement("iframe");
          newVideo.classList.add("video");
          newVideo.id = "ifrvideo";
          newVideo.src = videoURL;
          newVideo.setAttribute("loading", "lazy");
          newVideo.setAttribute("frameborder", "0");
          newVideo.setAttribute(
            "allow",
            "autoplay; fullscreen; encrypted-media; picture-in-picture;"
          );
          trailersContainer.prepend(newVideo);
        } else {
          --trailersCount;
        }
      });
    }

    if (video.type == "Teaser" && teasersCount < 2) {
      teasersCount++;

      checkRestricted(video.key).then((res) => {
        if (!res) {
          const videoURL = `https://www.youtube.com/embed/${video.key}`;
          const newVideo = document.createElement("iframe");
          newVideo.classList.add("video");
          newVideo.src = videoURL;
          newVideo.setAttribute("loading", "lazy");
          newVideo.setAttribute("frameborder", "0");
          newVideo.setAttribute(
            "allow",
            "autoplay; fullscreen; encrypted-media; picture-in-picture;"
          );
          teasersContainer.prepend(newVideo);
        } else {
          --teasersCount;
        }
      });
    }
  });

  setTimeout(() => {
    if (trailersCount + teasersCount == 0) {
      const vidSection = document.querySelector(".videos");
      vidSection.style.display = "none";
    } else if (trailersCount == 0) {
      const trailerHeader = document.querySelector(".Trailers__header-box");
      trailerHeader.style.display = "none";
      trailersContainer.style.display = "none";
    } else if (teasersCount == 0) {
      const teaserHeader = document.querySelector(".Teasers__header-box");
      teaserHeader.style.display = "none";
      teasersContainer.style.display = "none";
    }
  }, 500);
};

const getPeopleInfo = () => {
  const peoples = document.querySelectorAll(".Cast__img");

  peoples.forEach((people) => {
    people.addEventListener("click", (evt) => {
      sessionStorage.setItem("personId", evt.target.id);
    });
  });
};

const setCast = (cast) => {
  const castContainer = document.querySelector(".Cast__container");
  let castCount = 0;

  cast.forEach((people) => {
    if (people.profile_path && castCount < 8) {
      const profile = document.createElement("div");
      profile.classList.add("Cast__profile");

      const imgContainer = document.createElement("div");
      imgContainer.classList.add("Cast__img-container");

      const anchor = document.createElement("a");
      anchor.href = "./people.html";

      const image = document.createElement("img");
      image.classList.add("Cast__img");
      image.src = ` https://image.tmdb.org/t/p/w154${people.profile_path}`;
      image.id = people.id;

      const name = document.createElement("div");
      name.classList.add("Cast__name");
      name.innerText = `${people.name}`;

      anchor.append(imgContainer);
      imgContainer.append(image);
      profile.append(anchor);
      profile.append(name);
      castContainer.append(profile);

      castCount++;
    }
  });

  if (castCount > 0) {
    getPeopleInfo();
  } else {
    const castSection = document.querySelector(".Cast__section");
    castSection.style.display = "none";
  }
};

const getRecommendInfo = () => {
  const images = document.querySelectorAll(".Recommended__img");

  images.forEach((img) => {
    img.addEventListener("click", (evt) => {
      console.dir(evt.target);
      if (movId) {
        sessionStorage.setItem("movId", evt.target.id);
      } else {
        sessionStorage.setItem("showId", evt.target.id);
      }
    });
  });
};

const setRecommedation = (data) => {
  const recommendContainer = document.querySelector(".Recommended__container");
  let recCount = 0;

  data.forEach((movie) => {
    if (movie.original_language === "en" && movie.poster_path) {
      const imgContainer = document.createElement("div");
      imgContainer.classList.add("Recommended__img-container");

      const anchor = document.createElement("a");
      anchor.href = "./details.html";

      const image = document.createElement("img");
      image.classList.add("Recommended__img");
      image.src = ` https://image.tmdb.org/t/p/w342${movie.poster_path}`;
      image.id = movie.id;

      imgContainer.append(anchor);
      anchor.append(image);
      recommendContainer.append(imgContainer);

      recCount++;
    }
  });

  if (recCount > 0) {
    getRecommendInfo();
  } else {
    const RecommendedSection = document.querySelector(".Recommended__section");
    RecommendedSection.style.display = "none";
  }
};

const getDetails = async (url) => {
  const res = await axios.get(url);
  console.log(res.data);
  setDetails(res.data);
  setVideos(res.data.videos.results);
  setCast(res.data.credits.cast);
  setRecommedation(res.data.recommendations.results);
};

if (movId) {
  apiUrl = `https://api.themoviedb.org/3/movie/${movId}?api_key=${APIKey}&language=en-US&append_to_response=videos,credits,recommendations,reviews`;
  getDetails(apiUrl);
} else if (showId) {
  apiUrl = `https://api.themoviedb.org/3/tv/${showId}?api_key=${APIKey}&language=en-US&append_to_response=videos,credits,recommendations,reviews`;
  getDetails(apiUrl);
} else {
}
