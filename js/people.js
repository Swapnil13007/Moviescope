const APIKey = "93ac677313f294316aab34b8d4ec8917";
const searchBox = document.querySelector(".searchBox__input");
const searchBtn = document.querySelector(".searchBox__btn");

searchBtn.addEventListener("click", (evt) => {
  sessionStorage.setItem("movieName", searchBox.value);
})

let movId = sessionStorage.getItem("movId");
let showId = sessionStorage.getItem("showId");
let personId = sessionStorage.getItem("personId");
let apiUrl = `https://api.themoviedb.org/3/person/${personId}?api_key=${APIKey}&language=en-US&append_to_response=combined_credits`;


const setPersonInfo = (data) => {
  const image = document.querySelector('.people__img');
  const bio = document.querySelector('.people__biography');

  image.src = `https://image.tmdb.org/t/p/w342${data.profile_path}`;

  if (data.biography) {
    bio.innerHTML = `${data.biography}`;
  } else {
    const bioBox = document.querySelector('.people__biography-box');
    bioBox.style.display = 'none';
  }
}

const getWorkInfo = () => {
  const images = document.querySelectorAll('.Work__img');

  images.forEach(img => {
    img.addEventListener("click", (evt) => {
      console.dir(evt.target);
      if (img.attributes.value === "movie") {
        sessionStorage.setItem("movId", evt.target.id);
        sessionStorage.removeItem("showId");
      } else {
        sessionStorage.setItem("showId", evt.target.id);
        sessionStorage.removeItem("movId");
      }
    })
  })

}

const setWorks = (works) => {
  const workContainer = document.querySelector('.Work__container');
  let workCount = 0;

  works.forEach(work => {

    if (work.popularity > 50.0 && work.vote_count > 1000 && work.poster_path) {

      const imgContainer = document.createElement('div');
      imgContainer.classList.add("Work__img-container");

      const anchor = document.createElement('a');
      anchor.href = "./details.html";

      const image = document.createElement('img');
      image.classList.add("Work__img");
      image.src = `https://image.tmdb.org/t/p/w342${work.poster_path}`;
      image.id = work.id;
      image.attributes.value = work.media_type;


      imgContainer.append(anchor);
      anchor.append(image);
      workContainer.append(imgContainer);

      workCount++;
    }

  });

  if (workCount > 0) {
    getWorkInfo();
  } else {
    const workSection = document.querySelector(".Work__section");
    workSection.style.display = "none";
  }
}

const getPersonInfo = async (url) => {
  const res = await axios.get(url);
  console.log(res.data);
  setPersonInfo(res.data);
  setWorks(res.data.combined_credits.cast);
}

getPersonInfo(apiUrl);