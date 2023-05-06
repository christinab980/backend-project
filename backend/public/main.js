
if(window.location.pathname === '/login') {
  const form = document.getElementById('form');
  const credsContainer = form.querySelector('#credentials-container');

  function stringifyFormData(fd) {
    const data = {};
    for (let key of fd.keys()) {
      data[key] = fd.get(key);
    }
    return JSON.stringify(data, null, 4);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const stringified = stringifyFormData(data);
    const response = await doLogin(stringified);
    location.href = response.redirectTo;
    location.href = response.redirectTo;
    console.log(`The user is logged in: ${response.isAuthenticated}`)
  };

  renderForm();
  form.addEventListener('submit', handleSubmit);

  function renderForm() {
    const html = `  
    <div class="input-field">
        <input type="text" name="username" id="username" placeholder="Enter Username">
    </div>
    <div class="input-field">
        <input type="password" name="password" id="password" placeholder="Enter Password">
    </div>
    <input type="submit" value="LogIn">
    `;
    credsContainer.innerHTML = html;
  }

  async function doLogin(body) {
    const data = await fetch('/login', {
      body,
      headers: {
        'Content-Type': 'application/json',
      }, 
      method: "POST"
    });
    const response = await data.json();
    return response;
  }
}

const input = document.getElementById('input-box');
const button = document.getElementById('submit-button');
const showContainer = document.getElementById('show-container');
const listContainer = document.getElementById('list');
const featureCharacters = document.getElementById("feature-characters");
const landingComics = document.getElementById("popular-comics");

const publicKey = '9c2c83f57023818abe5c3258493fb406';
const privateKey = 'bd3e13633fefcb16b1f1d283c66344f1dbddc5ef';
const timeStamp = 1683240244972;
const hashValue = '2db36f8a451b0bbf1883bccc24d901af';

let date = new Date();

button.addEventListener('click', () => {
  getResults();
  // getComics();
})

function displayWords(value) {
  input.value = value;
  removeElements();
}

listContainer.innerHTML = "";

function removeElements() { 
  listContainer.innerHTML = " ";
}

input.addEventListener("keyup", async () => {
  removeElements();

  if(input.value.length < 3) {
    return false;
  }

  const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${timeStamp}&apikey=${publicKey}&hash=${hashValue}&nameStartsWith=${input.value}`

  const response = await fetch(url);
  const jsonData = await response.json();

  jsonData.data["results"].forEach((result) => {
    let name = result.name;
    let div = document.createElement("div");
    div.style.cursor = "pointer";
    div.classList.add("autocomeplete-items");
    div.setAttribute("onclick", "displayWords('"+ name +"')");
    let word = "<b>" + name.substr(0, input.value.length) + "</b>";
    word += name.substr(input.value.length);
    div.innerHTML = `<p class="item"> ${word} </p>`;
      listContainer.append(div);
  })
})

 
async function getResults() {
  list === [];
  if (input.value.trim().length < 1) {
    alert("Input cannot be blank")
  }
  showContainer.innerHTML = ""
  const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${timeStamp}&apikey=${publicKey}&hash=${hashValue}&name=${input.value}`
  
  const response = await fetch(url);
  const jsonData = await response.json();
  console.log(jsonData)
  jsonData.data['results'].forEach((element) => {
    showContainer.innerHTML = `
      <div class="card-container"> 
      <div class="container-character-img">
        <img src = "${element.thumbnail['path']}.${element.thumbnail['extension']}" /> 
      </div>
    <div class="character-name"> ${element.name} </div>
    <div class="character-description"> ${element.description} </div>
    </div>
    <div class="character-specifics"> <p> Comic: ${element.comics.available} | Series: ${element.series.available} | Stories: ${element.stories.available} | Events: ${element.events.available} </p>
    </div>
    `})
};


async function landingCharacters(query) {
  featureCharacters.innerHTML = ""
  value === spiderman;
  const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${timeStamp}&apikey=${publicKey}&hash=${hashValue}&name=${value}`
  
  const response = await fetch(url);
  const jsonData = await response.json();
  console.log(jsonData);

  jsonData.data['results'].forEach((element) => {
    featureCharacters.innerHTML = `
      <div class="landing-character-img">
        <img src = "${element.thumbnail['path']}.${element.thumbnail['extension']}" /> 
      </div>
      `
  })
}

window.onload = () => {
  landingCharacters();
}