# client-server-game-architecture

Client server real-time multiplayer game architecture based on UDP (via webRTC)

### Based on
[Real Time Multiplayer in HTML5](http://buildnewgames.com/real-time-multiplayer/)  
[Fast-Paced Multiplayer (Part I): Client-Server Game Architecture](https://www.gabrielgambetta.com/client-server-game-architecture.html)

### Technologies

  - [three.js](https://github.com/mrdoob/three.js)
  - [geckos.io](https://github.com/geckosio/geckos.io)

### Development

Install dependencies:
```sh
cd client
npm install

cd server
npm install
```

Client run:
```sh
cd client
npm start
```

Server run:
```sh
cd server
npm start
```

### Todos

 - [ ] Movement via authoritative server
 - [ ] Client-Side Prediction and Server Reconciliation
 - [ ] Add multiplayer
 - [ ] Entity Interpolation
