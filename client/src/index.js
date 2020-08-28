import geckos from "@geckos.io/client";
import css from "./styles.css";
import Game from "./Game";

const channel = geckos({ port: 3000 });
const game = new Game();

channel.onConnect((error) => {
  if (error) {
    console.error(error.message);
    return;
  }

  channel.onDisconnect(() => {});

  channel.on("join", ({ position }) => {
    game.init(position);
  });
});
