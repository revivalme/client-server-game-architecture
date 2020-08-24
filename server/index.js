import Geckos from "@geckos.io/server";
import Game from "./Game.js";

const io = Geckos.default();
io.listen(3000);

const game = new Game(io, {
  maxPlayerCapacity: 3,
});

io.onConnection((player) => {
  if (game.playerCount < game.maxPlayerCapacity) {
    game.join(player);
  }
});
