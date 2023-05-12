// let form = document.getElementById('form')

// form.addEventListener('submit', function(e){
//     e.preventDefault() // prevents the form from auto-submitting

// let username = document.getElementById('username').value;
// console.log('Username:', username);

// let password = document.getElementById('password').value;
// console.log('Password:', password);

// })




// function stringifyFormData(fd) {
//     const data = {};
//     for (let key of fd.keys()) {
//       data[username] = fd.get('username'),
//       data[password] = fd.get('password');
//     };

//     return JSON.stringify(data, null, 4);
//   }


// function stringifyFormData(fd) {
//     const data = {
//       username: fd.get('username'),
//       password: fd.get('password'),
//     };
//     console.log(data);
//     return JSON.stringify(data, null, 4);
// };
  
const handleSubmit = (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    console.log('Username: '+username, 'Password: '+password);
    // return (username, password);
};

const form = document.getElementById('form');
form.addEventListener('submit', handleSubmit);

// const insertUser = async (username, password) => {
//   try {
//     await db.none('INSERT INTO users (username, password) VALUES ($1, $2)', [username, password]);
//     console.log('user inserted successfully');
//   } catch (error) {
//     console.error('Error inserting user:', error);
//   }
// };

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   const username = document.getElementById('username').value;
//   const password = document.getElementById('password').value;
//   await insertUser(username, password);
// };

// const form = document.getElementById('form');
// form.addEventListener('submit', handleSubmit);

// createUsersTable();
