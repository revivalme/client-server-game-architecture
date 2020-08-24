import Geckos from "@geckos.io/server";

const io = Geckos.default();
io.listen(3000);

io.onConnection((player) => {
  player.emit("connect", {
    position: { x: 0, y: 0, z: 0 },
  });
});
