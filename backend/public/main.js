//input global values
const input = document.getElementById('input-box');
const button = document.getElementById('submit-button');
const showContainer = document.getElementById('show-container');
const listContainer = document.getElementById('list');
const showComics = document.getElementById('show-comics');
const comicPageInput = document.getElementById('comic-page-input');
const comicPageBtn = document.getElementById('comic-page-btn');
const characterPageBtn = document.getElementById('character-page-btn');
const characterPageInput = document.getElementById('character-page-input');

//landing or home endpoint global values
const featureCharacters = document.getElementById("feature-characters");
const landingComics = document.getElementById("popular-comics");
const featureCharactersTitle = document.getElementById("featuredCharacterTitle");
const imgComicInsert = document.getElementById('imgComicInsert');
const landingPageModal = document.getElementById('landing-page-modal');

//comic endpoint global values
const comicPageFeature = document.getElementById('comics-page-feature');
const comicPageImg = document.getElementById('comic-page-container');
const comicPageModal = document.getElementById('comic-page-modal');
const closeModalBtn = document.getElementById("btn-close");
const trendingComics = document.getElementById('trending-comics')
const comicList = document.getElementById('comic-page-list');

//characher endpoint global values
const spotlightCharacters = document.getElementById('spotlight-character');
const spotlightCharactersTitle = document.getElementById('spotlight-character-title');
const characterResults = document.getElementById('charcter-page-display-container');
const characterList = document.getElementById('character-page-list')
const comicResults = document.getElementById('character-page-show-comics');
const characterModal = document.getElementById('character-page-modal');

//api keys and private info -- need to put this is a config file
const publicKey = '9c2c83f57023818abe5c3258493fb406';
const privateKey = 'bd3e13633fefcb16b1f1d283c66344f1dbddc5ef';
const timeStamp = 1683240244972;
const hashValue = '2db36f8a451b0bbf1883bccc24d901af';

let date = new Date();
let characterIdValue = "";
let fetchCharactersforLandingPlace = ["falcon", "daredevil", "thor (goddess of thunder)", "adam warlock", "hulk"];
let fetchCharactersArray = ["thor", "iron man", "hulk", "Spider-man (Peter Parker)", "She-Hulk (Jennifer Walters)", "captain america", "Spider-Man (Miles Morales)", "THANOS"];

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
    console.log(_characterId)
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

  for(let i = 1; i < 5; i ++) {
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

if(window.location.pathname === '/comic') {

comicPageBtn.addEventListener('click', async () => {
  const _characterIdValue = await getResults();
  characterIdValue = _characterIdValue
  getComics();
})

function displayWords(value) {
  comicPageInput.value = value;
  removeElements();
}

comicList.innerHTML = "";

function removeElements() { 
  comicList.innerHTML = " ";
}

comicPageInput.addEventListener("keyup", async () => {

  if(comicPageInput.value.length < 4) {
    return false;
  }

  const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${timeStamp}&apikey=${publicKey}&hash=${hashValue}&nameStartsWith=${comicPageInput.value}`

  const response = await fetch(url);
  const jsonData = await response.json();
  removeElements();

  jsonData.data["results"].forEach((result) => {
    let name = result.name;
    let div = document.createElement("div");
    div.style.cursor = "pointer";
    div.classList.add("autocomeplete-items");
    div.setAttribute("onclick", "displayWords('"+ name +"')");
    let word = "<b>" + name.substr(0, comicPageInput.value.length) + "</b>";
    word += name.substr(comicPageInput.value.length);
    div.innerHTML = `<p class="item"> ${word} </p>`;
    comicList.append(div);
  })
})

async function getResults() {
  if (comicPageInput.value.trim().length < 1) {
    alert("Input cannot be blank")
  }
  showContainer.innerHTML = ""
  const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${timeStamp}&apikey=${publicKey}&hash=${hashValue}&name=${comicPageInput.value}`
  
  const response = await fetch(url);
  const jsonData = await response.json();
  console.log(jsonData)
  let _characterId = ""; 
  jsonData.data['results'].forEach((element) => { 
    _characterId = element.id 
    console.log(_characterId)
  })

  renderResults(jsonData)
  return _characterId 
};

async function fetchArrayOfComics() {
  const url = `https://gateway.marvel.com:443/v1/public/comics?characters=1016181%2C%201009368%2C%201009664&apikey=${publicKey}&ts=${timeStamp}&hash=${hashValue}`
  const response = await fetch(url);
  const data = await response.json();
  console.log(data)

  renderTrendingComics(data)
}

async function renderTrendingComics(data) {
  const div = document.createElement('div')
  div.className = "trending-comics-container"
  trendingComics.append(div)

  const divTitle = document.createElement('h2')
  divTitle.className = "trending-comics-title"
  divTitle.textContent = "Trending Comics"
  div.append(divTitle)

  const divContent = document.createElement('div')
  divContent.className = 'trending-container'
  div.append(divContent)

  for(let i = 1; i < 6; i++) {

    const divContainer = document.createElement('div')
    divContainer.className = "trending-comic-img-container"
    divContent.append(divContainer)

    const img = document.createElement('img')
    const imgPath = data.data.results[i].thumbnail['path']
    const extension = data.data.results[i].thumbnail['extension']
    img.src = imgPath + "." + extension
    const comicId = data.data.results[i].id
    img.id = `treding-comic-img-${comicId}`
    divContainer.append(img)

    const div2 = document.createElement('div')
    div2.className = "trending-comics-name"
    div2.innerHTML = `${data.data.results[i].title}`
    divContainer.append(div2)

    function renderComic() {
      const renderedComicName = document.getElementById('modal-name')
      renderedComicName.innerHTML = `${data.data.results[i].title}`

      const renderedComicImg = document.getElementById('modal-img')
      renderedComicImg.src = `${imgPath + "." + extension}`

      const renderedComicPublishDate = document.getElementById('modal-publish-info')
      renderedComicPublishDate.innerHTML = `<h3> Published: </h3> ${moment(data.data.results[i].dates[0].date).format("LL")}`

      const modalWriter = document.getElementById('modal-writer')
      modalWriter.innerHTML = `<h3> Writer: </h3> <p> ${data.data.results[i].creators.items.find((creator) => creator.role === 'writer').name} </p> `
      
      const modalCoverArtist = document.getElementById('modal-cover-artist')
      modalCoverArtist.innerHTML = `<h3> Cover Artist: </h3> <p> ${(data.data.results[i].creators.items.find((creator) => creator.role === "colorist (cover)") !== undefined) ? data.data.results[i].creators.items.find((creator) => creator.role === "colorist (cover)").name : data.data.results[i].creators.items.find((creator) => creator.role === "penciller (cover)").name}</p>`
      
      const modalDescription = document.getElementById('modal-description')
      modalDescription.innerHTML = `<h3> Description: </h3> <p> ${data.data.results[i].description} </p>`

      const modalPriceInfo = document.getElementById('modal-price-info')
      modalPriceInfo.innerHTML = `<h3> Price: </h3> <p> $${data.data.results[i].prices[0].price} </p>`

      const button1 = document.getElementById('modal-buy-now-button')
      console.log(button1)
      button1.innerHTML = `<a href= ${data.data.results[i].urls[1].url} target="_blank"> Buy Now </a>`
    }
      const characterBookBtn = document.getElementById(`treding-comic-img-${comicId}`);
      
      characterBookBtn.addEventListener('click', () => {
      renderComic();
      openModal();
    })
  }
}

async function renderResults(jsonData) {
  const div = document.createElement('div')
  div.className = 'comic-page-results-container'
  showContainer.append(div)

  const div1 = document.createElement('div')
  div1.className = 'comic-page-img-container'
  div.append(div1)

  const img = document.createElement('img')
  img.className = "comic-page-character-img"
  const imgPath = jsonData.data.results[0].thumbnail['path']
  const extension = jsonData.data.results[0].thumbnail['extension']
  img.src = imgPath + "." + extension
  div1.append(img)

  const div2 = document.createElement('div')
  div2.className = "comic-page-info-container"
  div.append(div2)

  const div3 = document.createElement('div')
  div3.className = 'comic-page-character-name'
  div3.innerHTML = `${jsonData.data.results[0].name}`
  div2.append(div3)

  const div4 = document.createElement('div')
  div4.className = 'comic-page-character-description'
  div4.innerHTML = `${jsonData.data.results[0].description}`
  div2.append(div4)
} 

async function getComics() {
  const url = `https://gateway.marvel.com:443/v1/public/comics?characters=${characterIdValue}?ts=${timeStamp}&apikey=${publicKey}&hash=${hashValue}`
  const response = await fetch(url);
  const jsonData = await response.json();

 renderComics(jsonData);
} 

async function renderComics(jsonData) {
 

  for(let i = 1; i < 10; i ++) {
    const div = document.createElement('div')
    div.className = "comic-page-comic-container"
    div.id = "comic-container"

    const div2 = document.createElement('div')
    div2.className = "comic-page-container-comic-img"
    div.append(div2)

    const img = document.createElement('img')
    const imgPath = jsonData.data.results[i].thumbnail['path']
    const extension = jsonData.data.results[i].thumbnail['extension']
    img.src = imgPath + "." + extension
    const comicId = jsonData.data.results[i].id
    img.id = `comic-feature-img-${comicId}`
    div2.append(img);

    const comicName = document.createElement('div')
    comicName.className = "comic-page-comic-name"
    comicName.textContent = jsonData.data.results[i].title
    div2.append(comicName)

    showComics.append(div)

    const comicBookBtn = document.getElementById(`comic-feature-img-${comicId}`);

    function renderComic() {
      const renderedComicName = document.getElementById('modal-name')
      renderedComicName.innerHTML = `${jsonData.data.results[i].title}`

      const renderedComicImg = document.getElementById('modal-img')
      renderedComicImg.src = `${imgPath + "." + extension}`

      const renderedComicPublishDate = document.getElementById('modal-publish-info')
      renderedComicPublishDate.innerHTML = `<h3> Published: </h3> ${moment(jsonData.data.results[i].dates[0].date).format("LL")}`

      const modalWriter = document.getElementById('modal-writer')
      modalWriter.innerHTML = `<h3> Writer: </h3> <p> ${jsonData.data.results[i].creators.items.find((creator) => creator.role === 'writer').name} </p> `
      
      const modalCoverArtist = document.getElementById('modal-cover-artist')
      modalCoverArtist.innerHTML = `<h3> Cover Artist: </h3> <p> ${(jsonData.data.results[i].creators.items.find((creator) => creator.role === "colorist (cover)") !== undefined) ? jsonData.data.results[i].creators.items.find((creator) => creator.role === "colorist (cover)").name : jsonData.data.results[i].creators.items.find((creator) => creator.role === "penciller (cover)").name}</p>`
      
      const modalDescription = document.getElementById('modal-description')
      modalDescription.innerHTML = `<h3> Description: </h3> <p> ${jsonData.data.results[i].description} </p>`

      const modalPriceInfo = document.getElementById('modal-price-info')
      modalPriceInfo.innerHTML = `<h3> Price: </h3> <p> $${jsonData.data.results[i].prices[0].price} </p>`

      const button1 = document.getElementById('modal-buy-now-button')
      console.log(button1)
      button1.innerHTML = `<a href= ${jsonData.data.results[i].urls[1].url} target="_blank"> Buy Now </a>`
    }
      comicBookBtn.addEventListener('click', () => {
      renderComic();
      openModal();
    })
  }
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
  _characterId = "1017576";
  const url = `https://gateway.marvel.com:443/v1/public/characters/${_characterId}?ts=${timeStamp}&apikey=${publicKey}&hash=${hashValue}`
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

  for(let i = 0; i < 10; i ++) {
   

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
    const comicId = jsonData.data.results[i].id
    img.id = `comic-feature-img-${comicId}`
    div2.append(img);

    const comicName = document.createElement('div')
    comicName.className = "comic-page-name"
    comicName.textContent = jsonData.data.results[i].title
    div2.append(comicName)

    divResults.append(div1)

    const comicBookBtn = document.getElementById(`comic-feature-img-${comicId}`);
    
    function renderComic() {
      const renderedComicName = document.getElementById('modal-name')
      renderedComicName.innerHTML = `${jsonData.data.results[i].title}`

      const renderedComicImg = document.getElementById('modal-img')
      renderedComicImg.src = `${imgPath + "." + extension}`

      const renderedComicPublishDate = document.getElementById('modal-publish-info')
      renderedComicPublishDate.innerHTML = `<h3> Published: </h3> ${moment(jsonData.data.results[i].dates[0].date).format("LL")}`

      const modalWriter = document.getElementById('modal-writer')
      modalWriter.innerHTML = `<h3> Writer: </h3> <p> ${jsonData.data.results[i].creators.items.find((creator) => creator.role === 'writer').name} </p> `
      
      const modalCoverArtist = document.getElementById('modal-cover-artist')
      modalCoverArtist.innerHTML = `<h3> Cover Artist: </h3> <p> ${(jsonData.data.results[i].creators.items.find((creator) => creator.role === "colorist (cover)") !== undefined) ? jsonData.data.results[i].creators.items.find((creator) => creator.role === "colorist (cover)").name : jsonData.data.results[i].creators.items.find((creator) => creator.role === "penciller (cover)").name}</p>`
      
      const modalDescription = document.getElementById('modal-description')
      modalDescription.innerHTML = `<h3> Description: </h3> <p> ${jsonData.data.results[i].description} </p>`

      const modalPriceInfo = document.getElementById('modal-price-info')
      modalPriceInfo.innerHTML = `<h3> Price: </h3> <p> $${jsonData.data.results[i].prices[0].price} </p>`

      const button1 = document.getElementById('modal-buy-now-button')
      console.log(button1)
      button1.innerHTML = `<a href= ${jsonData.data.results[i].urls[1].url} target="_blank"> Buy Now </a>`
    }
    
    comicBookBtn.addEventListener('click', () => {
      renderComic();
      openModal();
    })
  }
}

async function comicModal() {
  const sectionModal = document.createElement('section');
  sectionModal.className = "modal-section hidden"
  sectionModal.id = "modal-section"
  comicPageModal.append(sectionModal)

  const div = document.createElement('div')
  div.className = 'flex'
  sectionModal.append(div)

  const closeButton = document.createElement('button')
  closeButton.id = 'btn-close'
  closeButton.className = 'btn-close'
  closeButton.textContent = 'x'
  closeButton.addEventListener('click', () => {
    closeModal()
  })
  div.append(closeButton)

  const div1 = document.createElement('div')
  div1.className = 'modal-content'
  sectionModal.append(div1)

  const imgContainer = document.createElement('div')
  imgContainer.className = 'modal-img-container'
  div1.append(imgContainer)

  const comicImg = document.createElement('img')
  comicImg.className = "modal-image"
  comicImg.id = "modal-img"
  imgContainer.append(comicImg)

  const comicContainer = document.createElement('div')
  comicContainer.className = "modal-description-container"
  div1.append(comicContainer)

  const comicTitle = document.createElement('div')
  comicTitle.id = "modal-name"
  comicTitle.className = "modal-description"
  comicContainer.append(comicTitle)

  const div2 = document.createElement('div')
  div2.id = "modal-publish-info"
  div2.className = 'modal-publish-info'
  comicContainer.append(div2)

  const div3 = document.createElement('div')
  div3.id = 'modal-writer'
  comicContainer.append(div3)

  const div4 = document.createElement('div')
  div4.id = 'modal-cover-artist'
  comicContainer.append(div4)

  const div5 = document.createElement('div')
  div5.id ="modal-description"
  comicContainer.append(div5)

  const div6 = document.createElement('div')
  div6.id = "modal-price-info"
  div6.className = 'modal-price-info'
  comicContainer.append(div6)  

  const buyNowButton = document.createElement('button')
  buyNowButton.id = 'modal-buy-now-button'
  buyNowButton.className = 'modal-buy-now-button'
  comicContainer.append(buyNowButton)
 
} 

function closeModal() {
  const modal = document.getElementById("comic-page-modal");
  const overlay = document.getElementById("overlay");

  modal.classList.add("hidden");
  overlay.classList.add("hidden");
}

function openModal() {
  const modal = document.getElementById("comic-page-modal");
  const overlay = document.getElementById("overlay");

  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
}

fetchArrayOfComics()
getComicsPage();
comicPageFeatureCharacter();
}

if(window.location.pathname === '/character') {

characterPageBtn.addEventListener('click', async () => {
  const _characterIdValue = await getResults();
  characterIdValue = _characterIdValue
  getComics();
})

function displayWords(value) {
  characterPageInput.value = value;
  removeElements();
}

characterList.innerHTML = "";

function removeElements() { 
  characterList.innerHTML = " ";
}

characterPageInput.addEventListener("keyup", async () => {

  if(characterPageInput.value.length < 4) {
    return false;
  }

  const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${timeStamp}&apikey=${publicKey}&hash=${hashValue}&nameStartsWith=${characterPageInput.value}`

  const response = await fetch(url);
  const jsonData = await response.json();
  removeElements();

  jsonData.data["results"].forEach((result) => {
    let name = result.name;
    let div = document.createElement("div");
    div.style.cursor = "pointer";
    div.classList.add("autocomeplete-items");
    div.setAttribute("onclick", "displayWords('"+ name +"')");
    let word = "<b>" + name.substr(0, characterPageInput.value.length) + "</b>";
    word += name.substr(characterPageInput.value.length);
    div.innerHTML = `<p class="item"> ${word} </p>`;
    characterList.append(div);
  })
})

async function getResults() {
  if (characterPageInput.value.trim().length < 1) {
    alert("Input cannot be blank")
  }
  characterResults.innerHTML = ""
  const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${timeStamp}&apikey=${publicKey}&hash=${hashValue}&name=${characterPageInput.value}`
  
  const response = await fetch(url);
  const jsonData = await response.json();
  console.log(jsonData)

  let _characterId = ""; 

  jsonData.data['results'].forEach((element) => { 
    _characterId = element.id 
    console.log(_characterId)
  })

  renderCharacterResults(jsonData)
  return _characterId 
};

async function renderCharacterResults(jsonData) {
    const div = document.createElement('div')
    div.className = 'comic-page-results-container'
    characterResults.append(div)
  
    const div1 = document.createElement('div')
    div1.className = 'comic-page-img-container'
    div.append(div1)
  
    const img = document.createElement('img')
    img.className = "comic-page-character-img"
    const imgPath = jsonData.data.results[0].thumbnail['path']
    const extension = jsonData.data.results[0].thumbnail['extension']
    img.src = imgPath + "." + extension
    div1.append(img)
  
    const div2 = document.createElement('div')
    div2.className = "comic-page-info-container"
    div.append(div2)
  
    const div3 = document.createElement('div')
    div3.className = 'comic-page-character-name'
    div3.innerHTML = `${jsonData.data.results[0].name}`
    div2.append(div3)
  
    const div4 = document.createElement('div')
    div4.className = 'comic-page-character-description'
    div4.innerHTML = `${jsonData.data.results[0].description}`
    div2.append(div4)
  } 
  getComics()


async function getComics() {

  const url = `https://gateway.marvel.com:443/v1/public/comics?characters=${characterIdValue}?ts=${timeStamp}&apikey=${publicKey}&hash=${hashValue}`
  const response = await fetch(url);
  const jsonData = await response.json();

 renderComics(jsonData);
} 

async function renderComics(jsonData) {

  for(let i = 0; i < 5; i ++) {
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
    const comicId = jsonData.data.results[i].id
    img.id = `treding-character-img-${comicId}`
    div2.append(img);

    const comicName = document.createElement('div')
    comicName.className = "comic-name"
    comicName.textContent = jsonData.data.results[i].title
    div2.append(comicName)

    comicResults.append(div)

    const characterBookBtn = document.getElementById(`treding-character-img-${comicId}`);
   
    function renderComic() {
      const renderedComicName = document.getElementById('modal-name')
      renderedComicName.innerText = `${jsonData.data.results[i].title}`

      const renderedComicImg = document.getElementById('modal-img')
      renderedComicImg.src = `${imgPath + "." + extension}`

      const renderedComicPublishDate = document.getElementById('modal-publish-info')
      renderedComicPublishDate.innerHTML = `<h3> Published: </h3> ${moment(jsonData.data.results[i].dates[0].date).format("LL")}`

      const modalWriter = document.getElementById('modal-writer')
      modalWriter.innerHTML = `<h3> Writer: </h3> <p> ${jsonData.data.results[i].creators.items.find((creator) => creator.role === 'writer').name} </p> `
      
      const modalCoverArtist = document.getElementById('modal-cover-artist')
      modalCoverArtist.innerHTML = `<h3> Cover Artist: </h3> <p> ${(jsonData.data.results[i].creators.items.find((creator) => creator.role === "colorist (cover)") !== undefined) ? jsonData.data.results[i].creators.items.find((creator) => creator.role === "colorist (cover)").name : jsonData.data.results[i].creators.items.find((creator) => creator.role === "penciller (cover)").name}</p>`
      
      const modalDescription = document.getElementById('modal-description')
      modalDescription.innerHTML = `<h3> Description: </h3> <p> ${jsonData.data.results[i].description} </p>`

      const modalPriceInfo = document.getElementById('modal-price-info')
      modalPriceInfo.innerHTML = `<h3> Price: </h3> <p> $${jsonData.data.results[i].prices[0].price} </p>`

      const button1 = document.getElementById('modal-buy-now-button')
      button1.innerHTML = `<a href= ${jsonData.data.results[i].urls[1].url} target="_blank"> Buy Now </a>`
    }

      characterBookBtn.addEventListener('click', () => {
      renderComic();
      openModal();
    })
  }
}

async function fetchCharcters() {
  
  const fetchedData = fetchCharactersArray.map( async (character, index) => {
    const url = `https://gateway.marvel.com:443/v1/public/characters?name=${character}&apikey=${publicKey}&ts=${timeStamp}&hash=${hashValue}`
    const response = await fetch(url);
    const jsonData = await response.json();

    return jsonData
  }) 
  
  Promise.all(fetchedData).then((values) => { 
    trendingPopularCharacterTitle()
    featuredCharacterPage(values) })

}

function trendingPopularCharacterTitle() {
  const trendingCharacters = document.createElement('div')
  trendingCharacters.textContent = "Trending in the Universe"
  spotlightCharactersTitle.append(trendingCharacters)
}

async function featuredCharacterPage(values) {

  for(let i = 0; i < 8; i++ ) {
  const div = document.createElement('div')
  div.className = 'features-container'
  spotlightCharacters.append(div)

  const div1 = document.createElement('div')
  div1.className = 'character-page-feature'
  div.append(div1)

  const div2 = document.createElement('div')
  div2.className = 'flip-card'
  div1.append(div2)

  const div3 = document.createElement('div')
  div3.className ='flip-card-inner'
  div2.append(div3)

  const div4 = document.createElement('div')
  div4.className = 'flip-card-front'
  div3.append(div4)

  const img = document.createElement('img')
  const imgPath = values[i].data.results[0].thumbnail['path']
  const extension = values[i].data.results[0].thumbnail['extension']
  img.src = imgPath + "." + extension
  img.className = 'popular-characters-img'
  div4.append(img)

  const div5 = document.createElement('div')
  div5.className = 'flip-card-back'
  div3.append(div5)

  const h2 = document.createElement('h2')
  h2.className = 'character-page-name'
  h2.innerHTML = `${values[i].data.results[0].name}`
  div5.append(h2)

  const p = document.createElement('p')
  p.className = 'character-page-description'
  p.innerHTML = `${values[i].data.results[0].description}`
  div5.append(p)

}}

async function comicModal() {
  const sectionModal = document.createElement('section');
  sectionModal.className = "modal-section hidden"
  sectionModal.id = "modal-section"
  characterModal.append(sectionModal)

  const div = document.createElement('div')
  div.className = 'flex'
  sectionModal.append(div)

  const closeButton = document.createElement('button')
  closeButton.id = 'btn-close'
  closeButton.className = 'btn-close'
  closeButton.textContent = 'x'
  closeButton.addEventListener('click', () => {
    closeModal()
  })
  div.append(closeButton)

  const div1 = document.createElement('div')
  div1.className = 'modal-content'
  sectionModal.append(div1)

  const imgContainer = document.createElement('div')
  imgContainer.className = 'modal-img-container'
  div1.append(imgContainer)

  const comicImg = document.createElement('img')
  comicImg.className = "modal-image"
  comicImg.id = "modal-img"
  imgContainer.append(comicImg)

  const comicContainer = document.createElement('div')
  comicContainer.className = "modal-description-container"
  div1.append(comicContainer)

  const comicTitle = document.createElement('div')
  comicTitle.id = "modal-name"
  comicTitle.className = "modal-description"
  comicContainer.append(comicTitle)

  const div2 = document.createElement('div')
  div2.id = "modal-publish-info"
  div2.className = 'modal-publish-info'
  comicContainer.append(div2)

  const div3 = document.createElement('div')
  div3.id = 'modal-writer'
  comicContainer.append(div3)

  const div4 = document.createElement('div')
  div4.id = 'modal-cover-artist'
  comicContainer.append(div4)

  const div5 = document.createElement('div')
  div5.id ="modal-description"
  comicContainer.append(div5)

  const div6 = document.createElement('div')
  div6.id = "modal-price-info"
  div6.className = 'modal-price-info'
  comicContainer.append(div6)  

  const buyNowButton = document.createElement('button')
  buyNowButton.id = 'modal-buy-now-button'
  buyNowButton.className = 'modal-buy-now-button'
  comicContainer.append(buyNowButton)
 
} 

function closeModal() {
  const modal = document.getElementById("character-page-modal");
  const overlay = document.getElementById("overlay");

  modal.classList.add("hidden");
  overlay.classList.add("hidden");
}

function openModal() {
  const modal = document.getElementById("character-page-modal");
  const overlay = document.getElementById("overlay");

  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
}


fetchCharcters() 

}

if(window.location.pathname === '/') {


  async function fetchCharctersforLandingPlace() {
  
    const fetchedData = fetchCharactersforLandingPlace.map( async (character, index) => {
      const url = `https://gateway.marvel.com:443/v1/public/characters?name=${character}&apikey=${publicKey}&ts=${timeStamp}&hash=${hashValue}`
      const response = await fetch(url);
      const jsonData = await response.json();
  
      return jsonData
    }) 
    
    Promise.all(fetchedData).then((values) => { 
      featuredLandingPage(values) })
  
  }

async function featuredLandingPage(values) {

  for(let i = 0; i < 5; i++ ) {
  const div = document.createElement('div')
  div.className = 'features-container'
  featureCharacters.append(div)

  const div1 = document.createElement('div')
  div1.className = 'character-page-feature'
  div.append(div1)

  const div2 = document.createElement('div')
  div2.className = 'flip-card'
  div1.append(div2)

  const div3 = document.createElement('div')
  div3.className ='flip-card-inner'
  div2.append(div3)

  const div4 = document.createElement('div')
  div4.className = 'flip-card-front'
  div3.append(div4)

  const img = document.createElement('img')
  const imgPath = values[i].data.results[0].thumbnail['path']
  const extension = values[i].data.results[0].thumbnail['extension']
  img.src = imgPath + "." + extension
  img.className = 'popular-characters-img'
  div4.append(img)

  const div5 = document.createElement('div')
  div5.className = 'flip-card-back'
  div3.append(div5)

  const h2 = document.createElement('h2')
  h2.className = 'character-page-name'
  h2.innerHTML = `${values[i].data.results[0].name}`
  div5.append(h2)

  const p = document.createElement('p')
  p.className = 'character-page-description'
  p.innerHTML = `${values[i].data.results[0].description}`
  div5.append(p)

}}

async function fetchDaredevilComics() {
  const url = `https://gateway.marvel.com:443/v1/public/comics?characters=1009262&apikey=${publicKey}&ts=${timeStamp}&hash=${hashValue}`
  const response = await fetch(url);
  const data = await response.json();
  console.log(data)

   renderLandingComics(data)
}

async function renderLandingComics(data) {
  const div = document.createElement('div')
  div.className = "landingPage-comics-container"
  landingComics.append(div)

  const divContent = document.createElement('div')
  divContent.className = 'landing-comics-container'
  div.append(divContent)

  for(let i = 1; i < 10; i++) {

    const divContainer = document.createElement('div')
    divContainer.className = "trending-comic-img-container"
    divContent.append(divContainer)

    const img = document.createElement('img')
    const imgPath = data.data.results[i].thumbnail['path']
    const extension = data.data.results[i].thumbnail['extension']
    img.src = imgPath + "." + extension
    const comicId = data.data.results[i].id
    img.id = `treding-comic-img-${comicId}`
    divContainer.append(img)

    const div2 = document.createElement('div')
    div2.className = "trending-comics-name"
    div2.innerHTML = `${data.data.results[i].title}`
    divContainer.append(div2)

    function renderComic() {
      const renderedComicName = document.getElementById('modal-name')
      renderedComicName.innerHTML = `${data.data.results[i].title}`

      const renderedComicImg = document.getElementById('modal-img')
      renderedComicImg.src = `${imgPath + "." + extension}`

      const renderedComicPublishDate = document.getElementById('modal-publish-info')
      renderedComicPublishDate.innerHTML = `<h3> Published: </h3> ${moment(data.data.results[i].dates[0].date).format("LL")}`

      const modalWriter = document.getElementById('modal-writer')
      modalWriter.innerHTML = `<h3> Writer: </h3> <p> ${data.data.results[i].creators.items.find((creator) => creator.role === 'writer').name} </p> `
      
      const modalCoverArtist = document.getElementById('modal-cover-artist')
      modalCoverArtist.innerHTML = `<h3> Cover Artist: </h3> <p> ${(data.data.results[i].creators.items.find((creator) => creator.role === "colorist (cover)") !== undefined) ? data.data.results[i].creators.items.find((creator) => creator.role === "colorist (cover)").name : data.data.results[i].creators.items.find((creator) => creator.role === "penciller (cover)").name}</p>`
      
      const modalDescription = document.getElementById('modal-description')
      modalDescription.innerHTML = `<h3> Description: </h3> <p> ${data.data.results[i].description} </p>`

      const modalPriceInfo = document.getElementById('modal-price-info')
      modalPriceInfo.innerHTML = `<h3> Price: </h3> <p> $${data.data.results[i].prices[0].price} </p>`

      const button1 = document.getElementById('modal-buy-now-button')
      console.log(button1)
      button1.innerHTML = `<a href= ${data.data.results[i].urls[1].url} target="_blank"> Buy Now </a>`
    }
      const characterBookBtn = document.getElementById(`treding-comic-img-${comicId}`);
      
      characterBookBtn.addEventListener('click', () => {
      renderComic();
      openModal();
    })
  }
}

async function comicModal() {
  const sectionModal = document.createElement('section');
  sectionModal.className = "modal-section hidden"
  sectionModal.id = "modal-section"
  landingPageModal.append(sectionModal)

  const div = document.createElement('div')
  div.className = 'flex'
  sectionModal.append(div)

  const closeButton = document.createElement('button')
  closeButton.id = 'btn-close'
  closeButton.className = 'btn-close'
  closeButton.textContent = 'x'
  closeButton.addEventListener('click', () => {
    closeModal()
  })
  div.append(closeButton)

  const div1 = document.createElement('div')
  div1.className = 'modal-content'
  sectionModal.append(div1)

  const imgContainer = document.createElement('div')
  imgContainer.className = 'modal-img-container'
  div1.append(imgContainer)

  const comicImg = document.createElement('img')
  comicImg.className = "modal-image"
  comicImg.id = "modal-img"
  imgContainer.append(comicImg)

  const comicContainer = document.createElement('div')
  comicContainer.className = "modal-description-container"
  div1.append(comicContainer)

  const comicTitle = document.createElement('div')
  comicTitle.id = "modal-name"
  comicTitle.className = "modal-description"
  comicContainer.append(comicTitle)

  const div2 = document.createElement('div')
  div2.id = "modal-publish-info"
  div2.className = 'modal-publish-info'
  comicContainer.append(div2)

  const div3 = document.createElement('div')
  div3.id = 'modal-writer'
  comicContainer.append(div3)

  const div4 = document.createElement('div')
  div4.id = 'modal-cover-artist'
  comicContainer.append(div4)

  const div5 = document.createElement('div')
  div5.id ="modal-description"
  comicContainer.append(div5)

  const div6 = document.createElement('div')
  div6.id = "modal-price-info"
  div6.className = 'modal-price-info'
  comicContainer.append(div6)  

  const buyNowButton = document.createElement('button')
  buyNowButton.id = 'modal-buy-now-button'
  buyNowButton.className = 'modal-buy-now-button'
  comicContainer.append(buyNowButton)
 
} 
fetchDaredevilComics()
fetchCharctersforLandingPlace()




}