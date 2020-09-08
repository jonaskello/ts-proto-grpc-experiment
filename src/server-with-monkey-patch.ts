import path from "path";
import * as ProtoLoader from "@grpc/proto-loader";
import * as grpc from "@grpc/grpc-js";
import * as TsProtoGreeter from "./proto/greeter";
import { monkeyPatchPackageDefWithTsProtoSerializers, TsProtoPackages, PatchServiceImpl } from "./monkey-patch";

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

// Build packages from ts proto generated code
const tsProtoPackages: TsProtoPackages = {
  greet: TsProtoGreeter,
};

// Monkey patch proto
monkeyPatchPackageDefWithTsProtoSerializers(packageDefinition, tsProtoPackages);

// Load package def
const grpcObj = grpc.loadPackageDefinition(packageDefinition) as any;

// Get service definition
const serviceDef = grpcObj.greet.Greeter.service;

// Create service implementation
const serviceImpl: PatchServiceImpl<TsProtoGreeter.Greeter> = {
  SayHello(call, callback) {
    console.log("SayHelloSayHello", call.request);
    callback(null, { message: "dsfadf" });
  },
};

// Create server
const server = new grpc.Server();

// Add the service
server.addService(serviceDef, serviceImpl);

// Start server
const port = 3002;
console.log(`Listening on ${port}`);
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), () => {
  server.start();
});
