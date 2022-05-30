# WebRTC web test app

## Requirements
- Node 14+

## Running the project

first install the dependencies
```shell
$ npm i
```

copy the env vars file and replace the vars with the needed values
```shell
$ cp .env.example .env
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
