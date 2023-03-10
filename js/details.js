const APIKey = "93ac677313f294316aab34b8d4ec8917";
const YtKey = "AIzaSyBI5os32tm3KM6tMxMloDrTXOfNbWJcIfc";
const searchBox = document.querySelector(".searchBox__input");
const searchBtn = document.querySelector(".searchBox__btn");

// https://image.tmdb.org/t/p/original/bigNth9ADumR0vsrA9GDjfEg3j4.jpg

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
}


const setVideos = (videos) => {
  const trailersContainer = document.querySelector(".Trailer__container");
  const teasersContainer = document.querySelector(".Teaser__container");
  let trailersCount = 0;
  let teasersCount = 0;

  // console.log(videos);

  videos.forEach(video => {
    if (video.type == "Trailer" && trailersCount < 2) {
      trailersCount++;

      checkRestricted(video.key).then((res) => {
        if (!res) {
          const videoURL = `https://www.youtube.com/embed/${video.key}`;
          const newVideo = document.createElement('iframe');
          newVideo.classList.add('video');
          newVideo.id = "ifrvideo";
          newVideo.src = videoURL;
          newVideo.setAttribute("loading", "lazy");
          newVideo.setAttribute("frameborder", "0");
          newVideo.setAttribute("allow", "autoplay; fullscreen; encrypted-media; picture-in-picture;");
          trailersContainer.prepend(newVideo);
        }
        else {
          --trailersCount;
        }
      })
    }

    if (video.type == "Teaser" && teasersCount < 2) {
      teasersCount++;

      checkRestricted(video.key).then((res) => {
        if (!res) {
          const videoURL = `https://www.youtube.com/embed/${video.key}`;
          const newVideo = document.createElement('iframe');
          newVideo.classList.add('video');
          newVideo.src = videoURL;
          newVideo.setAttribute("loading", "lazy");
          newVideo.setAttribute("frameborder", "0");
          newVideo.setAttribute("allow", "autoplay; fullscreen; encrypted-media; picture-in-picture;");
          teasersContainer.prepend(newVideo);
        }
        else {
          --teasersCount;
        }
      })
    }

  });

  setTimeout(() => {
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
  }, 500);

}

const setCast = (cast) => {
  const castContainer = document.querySelector(".Cast__container");
  let castCount = 0;

  cast.forEach(people => {
    if (people.profile_path && castCount < 8) {

      const profile = document.createElement('div');
      profile.classList.add("Cast__profile");

      const imgContainer = document.createElement('div');
      imgContainer.classList.add("Cast__img-container");

      const image = document.createElement('img');
      image.classList.add("Cast__img");
      image.src = ` https://image.tmdb.org/t/p/w154${people.profile_path}`;

      const name = document.createElement('div');
      name.classList.add("Cast__name");
      name.innerText = `${people.name}`;

      imgContainer.append(image);
      profile.append(imgContainer);
      profile.append(name);
      castContainer.append(profile);

      castCount++;
    }
  })
}


const getDetails = async (url) => {
  const res = await axios.get(url);
  console.log(res.data);
  setDetails(res.data);
  setVideos(res.data.videos.results);
  setCast(res.data.credits.cast);
}

if (movId) {
  apiUrl = `https://api.themoviedb.org/3/movie/${movId}?api_key=${APIKey}&language=en-US&append_to_response=videos,credits`;
  getDetails(apiUrl);
}
else if (showId) {
  apiUrl = `https://api.themoviedb.org/3/tv/${showId}?api_key=${APIKey}&language=en-US&append_to_response=videos,credits`;
  getDetails(apiUrl);
}
else {

}
