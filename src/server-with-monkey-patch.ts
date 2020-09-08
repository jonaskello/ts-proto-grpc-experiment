import path from "path";
import * as ProtoLoader from "@grpc/proto-loader";
import * as grpc from "@grpc/grpc-js";
import { customPackageDefinition } from "./custom-package-def";
import * as TsProtoGreeter from "./proto/greeter";

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

// const customPackageDef = customPackageDefinition;

const TsProtoPackages: { [packageName: string]: any } = {
  greet: TsProtoGreeter,
};

for (const [topKey, anyDef] of Object.entries(packageDefinition)) {
  if (isServiceDefinition(anyDef)) {
    const [packageName, methodName] = topKey.split(".");
    for (const [methodKey, methodDef] of Object.entries(anyDef)) {
      console.log("topKey", topKey);
      console.log("methodDef", methodKey, methodDef);
      //   methodDef.requestDeserialize = undefined;
      const requestTypeName = (methodDef.requestType.type as any).name;
      const responseTypeName = (methodDef.responseType.type as any).name;
      //   const TsProto = Greeter as { [key: string]: any };
      const tsProtoPackage = TsProtoPackages[packageName];
      console.log("ts proto requestType", tsProtoPackage[requestTypeName]);
      console.log("ts proto responseType", tsProtoPackage[responseTypeName]);
    }
  }
}

function isServiceDefinition(
  anyDef: ProtoLoader.AnyDefinition
): anyDef is ProtoLoader.ServiceDefinition {
  // ServiceDefinition | MessageTypeDefinition | EnumTypeDefinition
  if (typeof anyDef === "object") {
    const obj = anyDef as { [key: string]: { path?: string } };
    if (obj[Object.keys(obj)[0]]?.path !== undefined) {
      return true;
    }
  }
  return false;
}

// console.log("packageDefinition", packageDefinition);

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
