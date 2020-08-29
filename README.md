# client-server-game-architecture

Client server real-time multiplayer game architecture based on UDP (via webRTC)

### Based on
[Real Time Multiplayer in HTML5](http://buildnewgames.com/real-time-multiplayer/)  
[Fast-Paced Multiplayer (Part I): Client-Server Game Architecture](https://www.gabrielgambetta.com/lag-compensation.html)

### Technologies

  - [three.js](https://github.com/mrdoob/three.js)
  - [geckos.io](https://github.com/geckosio/geckos.io)

### Development

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
