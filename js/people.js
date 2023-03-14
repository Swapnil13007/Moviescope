const APIKey = "93ac677313f294316aab34b8d4ec8917";
const searchBox = document.querySelector(".searchBox__input");
const searchBtn = document.querySelector(".searchBox__btn");

searchBtn.addEventListener("click", (evt) => {
  sessionStorage.setItem("movieName", searchBox.value);
})

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

const getPersonInfo = async (url) => {
  const res = await axios.get(url);
  console.log(res.data);
  setPersonInfo(res.data);
}

getPersonInfo(apiUrl);