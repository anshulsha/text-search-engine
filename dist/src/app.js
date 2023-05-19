"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var node_cluster_1 = __importDefault(require("node:cluster"));
var node_os_1 = require("node:os");
var node_process_1 = __importDefault(require("node:process"));
var body_parser_1 = __importDefault(require("body-parser"));
// import routes from "./routes/"
var numCPUs = (0, node_os_1.cpus)().length;
if (node_cluster_1.default.isPrimary) {
    console.log("Primary ".concat(node_process_1.default.pid, " is running"));
    console.log("Application started on port 8000!");
    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
        node_cluster_1.default.fork();
    }
    node_cluster_1.default.on("exit", function (worker, code, signal) {
        console.log("worker ".concat(worker.process.pid, " died"));
        node_cluster_1.default.fork();
    });
}
else {
    var app = (0, express_1.default)();
    app.use(body_parser_1.default.urlencoded({
        extended: true,
    }));
    app.use(body_parser_1.default.json());
    // app.use("/api/v1", routes);
    app.get("/", function (req, res) {
        for (var i = 0; i < 99999999; i++)
            i++;
        res.send("Application works! ".concat(node_process_1.default.pid));
    });
    app.listen(8000, function () { });
    console.log("Worker ".concat(node_process_1.default.pid, " started"));
}
