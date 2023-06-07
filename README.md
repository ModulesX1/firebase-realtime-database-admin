
# Firebase Realtime Database Admin

Firebase Realtime Database Admin is a wrapper library for interacting with Firebase Realtime Database using Node.js. It provides simplified methods for fetching, inserting, removing, and updating data in the database.

## Installation

```bash
npm install firebase-realtime-database-admin
```

## Usage
```js
const { Firebase } = require('firebase-realtime-database-admin');

// Initialize Firebase Realtime Database
const firebaseConfig = {
  credential: {...}, // JSON account service key
  databaseURL: 'https://your-database-url.firebaseio.com',
};
const firebase = new Firebase(firebaseConfig);

// Example usage: Fetch data from a database location
firebase.fetch('/users')
  .then((data) => {
    console.log('Fetched data:', data);
  })
  .catch((error) => {
    console.error('Error fetching data:', error);
  });

// Example usage: Insert data into a database location
const newData = { name: 'John Doe', age: 25 };
firebase.insert('/users', newData)
  .then(() => {
    console.log('Data inserted successfully');
  })
  .catch((error) => {
    console.error('Error inserting data:', error);
  });

// Example usage: Remove data from a database location
const dataToRemove = { id: 'abc123', name: 'John Doe' };
firebase.remove('/users', dataToRemove)
  .then(() => {
    console.log('Data removed successfully');
  })
  .catch((error) => {
    console.error('Error removing data:', error);
  });

// Example usage: Update data in a database location
const dataToUpdate = { id: 'abc123', name: 'John Smith' };
firebase.update('/users', dataToUpdate)
  .then(() => {
    console.log('Data updated successfully');
  })
  .catch((error) => {
    console.error('Error updating data:', error);
  });
```
