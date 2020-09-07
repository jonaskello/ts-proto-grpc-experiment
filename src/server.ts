import * as grpc from "@grpc/grpc-js";
import { loadProtoToPackageDefinition } from "./load-proto";

// const packageDefinition = loadProtoToPackageDefinition();

const packageDefinition = {
  "greet.Greeter": {
    SayHello: {
      path: "/greet.Greeter/SayHello",
      requestStream: false,
      responseStream: false,
      requestSerialize: (value: any): Buffer => {
        console.log("requestSerialize");
        return undefined as any;
      },
      requestDeserialize: (value: any): Buffer => {
        console.log("requestDeserialize");
        return undefined as any;
      },
      responseSerialize: (value: any): Buffer => {
        console.log("responseSerialize");
        return undefined as any;
      },
      responseDeserialize: (value: any): Buffer => {
        console.log("responseDeserialize");
        return undefined as any;
      },
    } as grpc.MethodDefinition<any, any>,
  },
};

console.log("packageDefinition", packageDefinition);

const grpcObj = grpc.loadPackageDefinition(packageDefinition) as any;

const serviceDef = grpcObj.greet.Greeter.service;

const serviceImpl = {
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
