const input = document.getElementById('input-box');
const button = document.getElementById('submit-button');
const showContainer = document.getElementById('show-container');
const listContainer = document.getElementById('list');
const featureCharacters = document.getElementById("feature-characters");
const landingComics = document.getElementById("popular-comics");
const showComics = document.getElementById('show-comics');
const showComic = document.getElementById('comic-container');
const comicPageFeature = document.getElementById('comics-page-feature');
const comicPageImg = document.getElementById('comic-page-container');
const comicPageModal = document.getElementById('comic-page-modal')
const modal = document.querySelector(".modal-section");
const overlay = document.querySelector(".overlay");
const closeModalBtn = document.querySelector(".btn-close");
const comicBookBtn = document.getElementById('comic-feature-img')

const publicKey = '9c2c83f57023818abe5c3258493fb406';
const privateKey = 'bd3e13633fefcb16b1f1d283c66344f1dbddc5ef';
const timeStamp = 1683240244972;
const hashValue = '2db36f8a451b0bbf1883bccc24d901af';

let date = new Date();
let characterIdValue = "";

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

if(window.location.pathname === '/search') {

  button.addEventListener('click', async () => {
  const _characterIdValue = await getResults();
  characterIdValue = _characterIdValue
  getComics();
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

  if(input.value.length < 4) {
    return false;
  }

  const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${timeStamp}&apikey=${publicKey}&hash=${hashValue}&nameStartsWith=${input.value}`

  const response = await fetch(url);
  const jsonData = await response.json();
  removeElements();

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
  if (input.value.trim().length < 1) {
    alert("Input cannot be blank")
  }
  showContainer.innerHTML = ""
  const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${timeStamp}&apikey=${publicKey}&hash=${hashValue}&name=${input.value}`
  
  const response = await fetch(url);
  const jsonData = await response.json();
  console.log(jsonData)
  let _characterId = ""; 
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
    ` 
    _characterId = element.id 
    console.log(input.value)
  })
  return _characterId 
};

async function getComics() {
  const url = `https://gateway.marvel.com:443/v1/public/comics?characters=${characterIdValue}?ts=${timeStamp}&apikey=${publicKey}&hash=${hashValue}`
  const response = await fetch(url);
  const jsonData = await response.json();

 renderComics(jsonData);
} 

async function renderComics(jsonData) {
  const divTitle = document.createElement('div')
  showContainer.append(divTitle)
  const comicTitle = document.createElement("h2");
  comicTitle.className = "comicTitle"
  comicTitle.textContent = 'Comics'
  divTitle.append(comicTitle)

  for(let i = 0; i < 3; i ++) {
    const div = document.createElement('div')
    div.className = "comic-container"
    div.id = "comic-container"

    const div2 = document.createElement('div')
    div2.className = "container-comic-img"
    div.append(div2)

    const img = document.createElement('img')
    const imgPath = jsonData.data.results[i].thumbnail['path']
    const extension = jsonData.data.results[i].thumbnail['extension']
    img.src = imgPath + "." + extension
    div2.append(img);

    const comicName = document.createElement('div')
    comicName.className = "comic-name"
    comicName.textContent = jsonData.data.results[i].title
    div2.append(comicName)

    showComics.append(div)
  }
}
}

async function landingCharacters(value) {
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

async function getComicsPage() {

  const url = `https://gateway.marvel.com:443/v1/public/comics?characters=1017576?ts=${timeStamp}&apikey=${publicKey}&hash=${hashValue}`
  const response = await fetch(url);
  const jsonData = await response.json();
  
  console.log(jsonData)
  renderComicsFeaturePage(jsonData)
  comicModal(jsonData);
}

async function comicPageFeatureCharacter() {
  input === "Thor (Goddess of Thunder)"
  const url = `https://gateway.marvel.com:443/v1/public/characters/1017576?ts=${timeStamp}&apikey=${publicKey}&hash=${hashValue}`
  const response = await fetch(url);
  const data = await response.json();
  console.log(data)

  renderCharacterForComicPage(data)
}

async function renderCharacterForComicPage(data) {
  const title = document.createElement('div')
  title.className = "thor-feature-title"
  const h2 = document.createElement('h2')
  h2.textContent = 'Featured Character: Thor - Goodness of Thunder'
  title.append(h2)
  comicPageFeature.append(title)

  const div = document.createElement('div')
  div.className = "thor-character-feature"
  comicPageFeature.append(div)

  const div1 = document.createElement('div')
  div1.className ="thor-img-container"
  div.append(div1)

  const thorImg = document.createElement('img')
  thorImg.className = "thorImg-comics-page"
  const imgPath = data.data.results[0].thumbnail['path']
  const extension = data.data.results[0].thumbnail['extension']
  thorImg.src = imgPath + "." + extension
  div1.append(thorImg)

  const div4 = document.createElement('div')
  div4.className = "thor-description-container"
  div.append(div4)

  const div2 = document.createElement('div')
  div2.className = "thor-description"
  div2.innerHTML = data.data.results[0].description
  div4.append(div2)

  const div3 = document.createElement('div')
  div3.className = "thor-stats"
  const comics = data.data.results[0].comics.available
  const series = data.data.results[0].series.available
  const stories = data.data.results[0].stories.available
  const events = data.data.results[0].events.available
  div3.innerHTML = `Comics: ${comics} | Series: ${series} | Stories: ${stories} | Events: ${events}`
  div4.append(div3)
}

async function renderComicsFeaturePage(jsonData) {

  const divResults = document.createElement('div')
  divResults.className = "thor-feature"
  comicPageFeature.append(divResults)

  for(let i = 0; i < 15; i ++) {
    const div1 = document.createElement('div')
    div1.className = "comic-page-container"
    div1.id = "comic-page-container"

    const div2 = document.createElement('div')
    div2.className = "comic-page-img-container"
    div1.append(div2)

    const img = document.createElement('img')
    const imgPath = jsonData.data.results[i].thumbnail['path']
    const extension = jsonData.data.results[i].thumbnail['extension']
    img.src = imgPath + "." + extension
    img.id = "comic-feature-img"
    div2.append(img);

    const comicName = document.createElement('div')
    comicName.className = "comic-page-name"
    comicName.textContent = jsonData.data.results[i].title
    div2.append(comicName)

    divResults.append(div1)
  }

}


async function comicModal(jsonData) {
  const sectionModal = document.createElement('section');
  sectionModal.className = "modal-section hidden"
  comicPageModal.append(sectionModal)

  const div = document.createElement('div')
  div.className = 'flex'
  sectionModal.append(div)

  const closeButton = document.createElement('button')
  closeButton.className = 'btn-close'
  closeButton.textContent = 'x'
  div.append(closeButton)

  const div1 = document.createElement('div')
  div1.className = 'modal-content'
  sectionModal.append(div1)

  const comicImg = document.createElement('img')
  comicImg.className = "modal-image"
  const imgPath = jsonData.data.results[0].thumbnail['path']
  const extension = jsonData.data.results[0].thumbnail['extension']
  comicImg.src = imgPath + "." + extension
  div1.append(comicImg)

  const comicContainer = document.createElement('div')
  comicContainer.className = "modal-description-container"
  div1.append(comicContainer)

  const comicTitle = document.createElement('div')
  comicTitle.className = "modal-description"
  comicTitle.innerHTML = jsonData.data.results[0].title
  div1.append(comicTitle)

  const div2 = document.createElement('div')
  const h3 = document.createElement('h3')
  const publishedDate = moment(jsonData.data.results[0].dates[0].date).format("LL")
  h3.textContent = "Published:"
  div2.append(h3)
  div2.append(publishedDate)
  div1.append(div2)

  const div3 = document.createElement('div')
  const writerdiv = document.createElement('div')
  const writerTitle = document.createElement('h3')
  writerTitle.textContent = "Writer:"
  writerdiv.innerHTML = jsonData.data.results[0].creators.items.find((creator) => creator.role === 'writer').name
  div3.append(writerTitle)
  div3.append(writerdiv)
  div1.append(div3)

  const div4 = document.createElement('div')
  const artistDiv = document.createElement('div')
  const artistTitle = document.createElement('h3')
  artistTitle.textContent = "Cover Artist:"
  artistDiv.innerHTML = jsonData.data.results[0].creators.items.find((creator) => creator.role === "colorist (cover)").name
  div4.append(artistTitle)
  div4.append(artistDiv)
  div1.append(div4)

  const div5 = document.createElement('div')
  const descriptionDiv = document.createElement('div')
  const descriptionTitle = document.createElement('h3')
  descriptionTitle.textContent = "Description:"
  descriptionDiv.innerHTML = jsonData.data.results[0].description
  div5.append(descriptionTitle)
  div5.append(descriptionDiv)
  div1.append(div5)

  const div6 = document.createElement('div')
  const priceDiv = document.createElement('div')
  const priceTitle = document.createElement('h3')
  const buyNowButton = document.createElement('button')
  buyNowButton.textContent = "Buy Now"
  buyNowButton.className = 'modal-buy-now-button'
  buyNowButton.id = 'modal-buy-now-button'
  priceTitle.textContent = "Price:"
  priceDiv.innerHTML = `$${jsonData.data.results[0].prices[0].price}`
  div6.append(priceTitle)
  div6.append(priceDiv)
  div6.append(buyNowButton)
  div1.append(div6)  

} 

function openModal() {
   modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
}

// comicBookBtn.addEventListener('click', openModal)


getComicsPage();
comicPageFeatureCharacter();

// window.onload = () => {
//   landingCharacters();
// }