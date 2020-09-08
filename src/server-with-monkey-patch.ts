import path from "path";
import * as ProtoLoader from "@grpc/proto-loader";
import * as grpc from "@grpc/grpc-js";
import { customPackageDefinition } from "./custom-package-def";
import * as TsProtoGreeter from "./proto/greeter";
import { Writer, Reader } from "protobufjs/minimal";

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

// const customPackageDef = customPackageDefinition;

type TsProtoPackages = { [packageName: string]: any };

type TsProtoMessage<TMessage> = {
  encode: (message: TMessage, writer?: Writer) => Writer;
  decode: (input: Uint8Array | Reader, length?: number) => TMessage;
  fromJSON: (object: any) => TMessage;
  toJSON: (message: TMessage) => unknown;
};

monkeyPatchSerializers({
  greet: TsProtoGreeter,
});

function monkeyPatchSerializers(tsProtoPackages: TsProtoPackages) {
  for (const [topKey, anyDef] of Object.entries(packageDefinition)) {
    // Only patch service definitions
    if (isServiceDefinition(anyDef)) {
      const [packageName, methodName] = topKey.split(".");
      for (const [methodKey, methodDef] of Object.entries(anyDef)) {
        console.log("topKey", topKey);
        console.log("methodDef", methodKey, methodDef);
        //   methodDef.requestDeserialize = undefined;
        // Get the names of the request and response types from the method defintion
        const requestTypeName = (methodDef.requestType.type as any).name;
        const responseTypeName = (methodDef.responseType.type as any).name;
        // Get the request and response types from ts proto
        const tsProtoPackage = tsProtoPackages[packageName];
        const tsProtoRequest = tsProtoPackage[requestTypeName] as TsProtoMessage<any>;
        const tsProtoResponse = tsProtoPackage[responseTypeName] as TsProtoMessage<any>;
        console.log("ts proto requestType", tsProtoRequest);
        console.log("ts proto responseType", tsProtoResponse);
        // Create the serializer functions
        const tsProtoSerializers = {
          requestSerialize(value: any): Buffer {
            console.log("requestSerialize");
            const message = tsProtoRequest.fromJSON(value);
            return tsProtoRequest.encode(message).finish() as Buffer;
          },
          requestDeserialize: (bytes: Buffer): object => {
            console.log("requestDeserialize", bytes);
            return tsProtoRequest.toJSON(tsProtoRequest.decode(bytes)) as object;
          },
          responseSerialize: (value: any): Buffer => {
            console.log("responseSerialize");
            const message = tsProtoResponse.fromJSON(value);
            return tsProtoResponse.encode(message).finish() as Buffer;
          },
          responseDeserialize: (bytes: Buffer): object => {
            console.log("responseDeserialize");
            return tsProtoResponse.toJSON(tsProtoResponse.decode(bytes)) as object;
          },
        };
        // Do the monkey patch
        methodDef.requestSerialize = tsProtoSerializers.requestSerialize;
        methodDef.requestDeserialize = tsProtoSerializers.requestDeserialize;
        methodDef.responseSerialize = tsProtoSerializers.responseSerialize;
        methodDef.responseDeserialize = tsProtoSerializers.responseDeserialize;
      }
    }
  }
}

function isServiceDefinition(anyDef: ProtoLoader.AnyDefinition): anyDef is ProtoLoader.ServiceDefinition {
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
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), () => {
  server.start();
});
