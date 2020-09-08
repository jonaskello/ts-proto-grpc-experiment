import path from "path";
import * as ProtoLoader from "@grpc/proto-loader";
import * as grpc from "@grpc/grpc-js";
import * as TsProtoGreeter from "./proto/greeter";
import { monkeyPatchPackageDefWithTsProtoSerializers } from "./monkey-patch";

const PROTO_OPTIONS = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: false,
  oneofs: true,
};

// Load proto
const PROTO_PATH = path.resolve(__dirname, path.join(__dirname, "../src/proto/greeter.proto"));
const packageDefinition = ProtoLoader.loadSync(PROTO_PATH, PROTO_OPTIONS);

// Monkey patch proto
monkeyPatchPackageDefWithTsProtoSerializers(packageDefinition, {
  greet: TsProtoGreeter,
});

// console.log("packageDefinition", packageDefinition);

const grpcObj = grpc.loadPackageDefinition(packageDefinition) as any;

const greeterCtor = grpcObj.greet.Greeter;

// console.log("greeterCtor", greeterCtor);

export const unitFoldersServiceClient = new greeterCtor("localhost:3002", grpc.ChannelCredentials.createInsecure());

const xxx = unitFoldersServiceClient.SayHello({ name: "olle" }, (error: any, result: any) => {
  console.log("_error", error);
  console.log("_result", result);
});

// console.log("xxx", xxx);
