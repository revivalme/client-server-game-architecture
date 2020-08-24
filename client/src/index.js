import geckos from "@geckos.io/client";
import css from "./styles.css";

const channel = geckos({ port: 3000 });

channel.onConnect((error) => {
  if (error) {
    console.error(error.message);
    return;
  }

  channel.onDisconnect(() => {});

  channel.on("connect", (data) => {
    console.log(data);
  });
});
