import express from "express";
import { Request, Response } from "express";
import cluster from "node:cluster";
import { cpus } from "node:os";
import process from "node:process";
import bodyParser from "body-parser";

import routes from "./routes/";

// const numCPUs: number = cpus().length;

// if (cluster.isPrimary) {
//   console.log(`Primary ${process.pid} is running`);
//   console.log("Application started on port 8000!");

//   // Fork workers.
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   cluster.on("exit", (worker, code, signal) => {
//     console.log(`worker ${worker.process.pid} died`);
//     cluster.fork();
//   });
// } else {
const app = express();
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use("/api/v1", routes);

app.listen(8000, () => {});
console.log(`Primary ${process.pid} is running`);
console.log("Application started on port 8000!");
// console.log(`Worker ${process.pid} started`);
// }
