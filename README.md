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