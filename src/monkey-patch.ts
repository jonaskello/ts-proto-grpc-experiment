import * as grpc from "@grpc/grpc-js";
import * as ProtoLoader from "@grpc/proto-loader";
import { Writer, Reader } from "protobufjs/minimal";

type ServiceFn<TRequest, TResponse> = (request: TRequest) => Promise<TResponse>;

export type PatchServiceImpl<T> = {
  readonly [P in keyof T]: T[P] extends ServiceFn<infer TRequest, infer TResponse>
    ? (call: grpc.ServerUnaryCall<TRequest, TResponse>, callback: grpc.sendUnaryData<TResponse>) => void
    : never;
};

export type TsProtoPackages = { [packageName: string]: any };

type TsProtoMessage<TMessage> = {
  encode: (message: TMessage, writer?: Writer) => Writer;
  decode: (input: Uint8Array | Reader, length?: number) => TMessage;
  fromJSON: (object: any) => TMessage;
  toJSON: (message: TMessage) => unknown;
};

export function monkeyPatchPackageDefWithTsProtoSerializers(
  packageDefinition: ProtoLoader.PackageDefinition,
  tsProtoPackages: TsProtoPackages
) {
  for (const [topKey, anyDef] of Object.entries(packageDefinition)) {
    // Only patch service definitions
    if (isServiceDefinition(anyDef)) {
      const [packageName] = topKey.split(".");
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
            // const message = tsProtoRequest.fromJSON(value);
            return tsProtoRequest.encode(value).finish() as Buffer;
          },
          requestDeserialize: (bytes: Buffer): object => {
            console.log("requestDeserialize", bytes);
            // return tsProtoRequest.toJSON(tsProtoRequest.decode(bytes)) as object;
            return tsProtoRequest.decode(bytes) as object;
          },
          responseSerialize: (value: any): Buffer => {
            console.log("responseSerialize", value);
            // const message = tsProtoResponse.fromJSON(value);
            // console.log("responseSerialize -- after fromJSON", message);
            return tsProtoResponse.encode(value).finish() as Buffer;
          },
          responseDeserialize: (bytes: Buffer): object => {
            console.log("responseDeserialize");
            // return tsProtoResponse.toJSON(tsProtoResponse.decode(bytes)) as object;
            return tsProtoResponse.decode(bytes) as object;
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
