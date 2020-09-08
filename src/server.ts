import path from "path";
import * as ProtoLoader from "@grpc/proto-loader";
import * as grpc from "@grpc/grpc-js";
import { customPackageDefinition } from "./packdef";
import { Greeter } from "./proto/greeter";
/*
const PROTO_OPTIONS = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: false,
  oneofs: true,
};

// Load proto
const PROTO_PATH = path.resolve(
  __dirname,
  path.join(__dirname, "../src/proto/greeter.proto")
);
const packageDefinition = ProtoLoader.loadSync(PROTO_PATH, PROTO_OPTIONS);
*/

const packageDefinition = customPackageDefinition;

console.log("packageDefinition", packageDefinition);

const grpcObj = grpc.loadPackageDefinition(packageDefinition) as any;

const serviceDef = grpcObj.greet.Greeter.service;

const serviceImpl /*: Greeter*/ = {
  SayHello(call: any, callback: any) {
    console.log("SayHelloSayHello", call.request);
    callback(null, { message: "dsfadf" });
  },
};

// Create server
const server = new grpc.Server();

server.addService(serviceDef, serviceImpl);

// Create and start server
const port = 3002;
console.log(`Listening on ${port}`);
server.bindAsync(
  `0.0.0.0:${port}`,
  grpc.ServerCredentials.createInsecure(),
  () => {
    server.start();
  }
);
