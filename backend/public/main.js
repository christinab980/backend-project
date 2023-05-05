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
const listContainer = document.querySelector('list');
const publicKey = '9c2c83f57023818abe5c3258493fb406';
const privateKey = 'bd3e13633fefcb16b1f1d283c66344f1dbddc5ef';
const timeStamp = 1683240244972;
const hashValue = '2db36f8a451b0bbf1883bccc24d901af';


let date = new Date();
console.log(date.getTime());

button.addEventListener('click', getResults)

async function getResults() {
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
      <img src = "${element.thumbnail['path']}.${element.thumbnail['extension']}"
      /> </div>
    <div class="character-name"> ${element.name} </div>
    <div class="character-description"> ${element.description} </div>
    </div>;
    `
  })
};

window.onload = () => {
  getResults();
}