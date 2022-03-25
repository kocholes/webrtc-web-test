# WebRTC web test app

## Requirements
- Node 14+

## Configure the firebase credentials
Create a file at the root level called `firebaseConfig.js`
```shell
$ touch firebaseConfig.js
```
create a firebase web app configuration from the [console](https://console.firebase.google.com/) and paste the credentials in the newly created file
```js
export const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};
```

## Running the project

first install the dependencies
```shell
$ npm i
```

then run the project
```shell
$ npm run dev
```

the app will start at [http://localhost:3000/](http://localhost:3000/)

## How to use the app
- Press `Start Offer` to create a connection hash
- In another browser or tab, paste the connection hash an press `Connect`
- If the connection is successful:
  - Write a message and press `Send` to send it to the other peer. 
  - Press `Ping` to calculate the transmission time from one peer to another
