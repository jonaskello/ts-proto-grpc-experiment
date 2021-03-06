import * as grpc from "@grpc/grpc-js";
import { customPackageDefinition } from "./custom-package-def";

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
