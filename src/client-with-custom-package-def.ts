import * as grpc from "@grpc/grpc-js";
import { customPackageDefinition } from "./custom-package-def";

const packageDefinition = customPackageDefinition;

// console.log("packageDefinition", packageDefinition);

const grpcObj = grpc.loadPackageDefinition(packageDefinition) as any;

const greeterCtor = grpcObj.greet.Greeter;

// console.log("greeterCtor", greeterCtor);

export const unitFoldersServiceClient = new greeterCtor(
  "localhost:3002",
  grpc.ChannelCredentials.createInsecure()
);

const xxx = unitFoldersServiceClient.SayHello(
  { name: "olle" },
  (error: any, result: any) => {
    console.log("_error", error);
    console.log("_result", result);
  }
);

// console.log("xxx", xxx);
