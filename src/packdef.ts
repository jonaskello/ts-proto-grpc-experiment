import * as grpc from "@grpc/grpc-js";
import { HelloRequest, HelloReply } from "./proto/greeter";

function deserialize(argBuf: Buffer): unknown {
  return HelloRequest.toJSON(HelloRequest.decode(argBuf));
}

function serialize(arg: object): Buffer {
  const message = HelloReply.fromJSON(arg);
  return HelloReply.encode(message).finish() as Buffer;
}

export const customPackageDefinition = {
  "greet.Greeter": {
    SayHello: {
      path: "/greet.Greeter/SayHello",
      requestStream: false,
      responseStream: false,
      requestSerialize: (value: any): Buffer => {
        console.log("requestSerialize");
        return serialize(value);
      },
      requestDeserialize: (bytes: Buffer): unknown => {
        console.log("requestDeserialize", bytes);
        return deserialize(bytes);
      },
      responseSerialize: (value: any): Buffer => {
        console.log("responseSerialize");
        return serialize(value);
      },
      responseDeserialize: (bytes: Buffer): unknown => {
        console.log("responseDeserialize");
        return serialize(bytes);
      },
    } as grpc.MethodDefinition<any, any>,
  },
};
