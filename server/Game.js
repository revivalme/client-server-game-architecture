import { v4 as uuidv4 } from "uuid";
import Player from "./Player.js";

export default class Game {
  constructor(io, options) {
    this.io = io;
    this.id = uuidv4();
    this.players = {};
    this.playerCount = 0;
    this.maxPlayerCapacity = options.maxPlayerCapacity || 3;

    // Start a physics and update loops at a fixed frequency
    setInterval(() => this.physicsLoop(), 15);
    setInterval(() => this.updateLoop(), 45);
  }

  subscribeToPlayer(player) {
    player.onDisconnect(() => this.leave(player));
    player.on("message", (payload) => this.onMessage(player, payload));
  }

  join(player) {
    // connect player to the game room
    player.join(this.id);
    // create player instance with default 0 0 0 position
    player.instance = new Player();
    // update Game info
    this.players[player.id] = player;
    this.playerCount++;

    this.subscribeToPlayer(player);

    // notify player about join and his init position
    player.emit("join", {
      position: player.instance.position,
    });
  }

  leave(player) {
    // leave game room
    player.leave();
    // update Game info
    delete this.players[player.id];
    this.playerCount -= 1;
  }

  onMessage(player, payload) {
    if (payload.type === "movement") {
      player.instance.inputs.push(payload);
    }
  }

  // update player position
  physicsLoop() {}

  // notify players in room with actual data
  updateLoop() {}
}
