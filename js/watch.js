const APIKey = "93ac677313f294316aab34b8d4ec8917";
const movId = localStorage.getItem("movId");
const showId = localStorage.getItem("showId");
const episodesSection = document.querySelector(".episodes__section");
let showApiUrl = ``;
let episodeApiUrl = ``;
let seasonNo = 1;
let episodeNo = 1;

const setPlayer = () => {
  const video = document.querySelector(".video");

  if (showId) {
    episodesSection.style.display = "block";
    video.src = `https://vidsrc.me/embed/tv?tmdb=${showId}&season=${seasonNo}&episode=${episodeNo}&color=4e1d77`;
  } else {
    video.src = `https://vidsrc.me/embed/movie?tmdb=${movId}&color=4e1d77`;
  }
};
setPlayer();

const resetSeasonDisabled = () => {
  const seasons = document.querySelectorAll(".season__number");
  seasons.forEach((season) => {
    season.disabled = false;
  });
};
const resetEpisodeDisabled = () => {
  const episodes = document.querySelectorAll(".episode__number");
  episodes.forEach((episode) => {
    episode.disabled = false;
  });
};

const setEpisodesDetails = (eData) => {
  const episodeBox = document.querySelector(".episode__numberBox");
  episodeBox.innerHTML = "";

  eData.episodes.forEach((episode) => {
    const btn = document.createElement("button");
    btn.classList.add("episode__number");
    btn.innerText = `Episode ${episode.episode_number}: ${episode.name}`;
    btn.id = episode.episode_number;
    episodeBox.appendChild(btn);
  });

  const episodes = document.querySelectorAll(".episode__number");

  episodes.forEach((episode) => {
    episode.addEventListener("click", (evt) => {
      episodeNo = evt.target.id;
      resetEpisodeDisabled();
      episodes[episodeNo - 1].disabled = true;
      setPlayer();
    });
  });
};

const setShowDetails = (showData) => {
  const seasonBox = document.querySelector(".season__numberBox");
  seasonBox.innerHTML = "";

  showData.seasons.forEach((season) => {
    const btn = document.createElement("button");
    if (season.season_number != 0) {
      btn.classList.add("season__number");
      btn.innerText = `${season.name}`;
      btn.id = season.season_number;
      seasonBox.appendChild(btn);
    }
  });

  const seasons = document.querySelectorAll(".season__number");
  seasons.forEach((season) => {
    season.addEventListener("click", (evt) => {
      seasonNo = evt.target.id;
      resetSeasonDisabled();
      resetEpisodeDisabled();

      seasons[seasonNo - 1].disabled = true;

      episodeApiUrl = `https://api.themoviedb.org/3/tv/${showId}/season/${seasonNo}?api_key=${APIKey}`;
      getEpisodeDetails(episodeApiUrl);
    });
  });

  seasons[seasonNo - 1].disabled = true;
};

const getShowDetails = async (showUrl) => {
  const showRes = await axios.get(showUrl);
  console.log(showRes.data);
  setShowDetails(showRes.data);
};
const getEpisodeDetails = async (episodeUrl) => {
  const episodeRes = await axios.get(episodeUrl);
  console.log(episodeRes.data);
  setEpisodesDetails(episodeRes.data);
};

if (showId) {
  episodesSection.style.display = "block";
  showApiUrl = `https://api.themoviedb.org/3/tv/${showId}?api_key=${APIKey}`;
  episodeApiUrl = `https://api.themoviedb.org/3/tv/${showId}/season/${seasonNo}?api_key=${APIKey}`;
  getShowDetails(showApiUrl);
  getEpisodeDetails(episodeApiUrl);
}
