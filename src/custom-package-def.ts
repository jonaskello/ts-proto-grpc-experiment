import * as grpc from "@grpc/grpc-js";
import { HelloRequest, HelloReply } from "./proto/greeter";

export const customPackageDefinition = {
  "greet.Greeter": {
    SayHello: {
      path: "/greet.Greeter/SayHello",
      requestStream: false,
      responseStream: false,
      requestSerialize: (value: any): Buffer => {
        console.log("requestSerialize");
        const message = HelloRequest.fromJSON(value);
        return HelloRequest.encode(message).finish() as Buffer;
      },
      requestDeserialize: (bytes: Buffer): unknown => {
        console.log("requestDeserialize", bytes);
        return HelloRequest.toJSON(HelloRequest.decode(bytes));
      },
      responseSerialize: (value: any): Buffer => {
        console.log("responseSerialize");
        const message = HelloReply.fromJSON(value);
        return HelloReply.encode(message).finish() as Buffer;
      },
      responseDeserialize: (bytes: Buffer): unknown => {
        console.log("responseDeserialize");
        return HelloReply.toJSON(HelloReply.decode(bytes));
      },
    } as grpc.MethodDefinition<any, any>,
  },
};
