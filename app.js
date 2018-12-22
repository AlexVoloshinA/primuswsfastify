const port = process.env.PORT || 7978;

const fastify = require("fastify"),
  Primus = require("primus"),
  app = fastify();

app.register(require("point-of-view"), {
  engine: {
    pug: require("pug")
  }
});

// var server = require("http").createServer(app),
const primus = new Primus(app.server, { transformer: "websockets" });

// console.log(primus);

// primus.on("connection", () => console.log(`Connection Open`));
primus.on("connection", spark => {
  console.log(`Hello Connection from Spark! with sparkId ${spark.id}`);

  spark.on("data", data => {
    console.log(
      `This data comes from the client to the server  ${data.message}...`
    );

    // Send data back to the client
    primus.write({
      data: data.message
    });
    // console.log(data.message);
    // primus;
  });
});

app.get("/", (req, reply) => {
  // Request from server to the client from WebSocket
  //   primus.write({ data: "This data come from the server to the client" });
  reply.view("/templates/index.pug", { text: "text" });
});

app.listen(port, () => console.log(`Listening to the port ${port}...`));
