/* eslint-disable */
import { Writer, Reader } from "protobufjs/minimal";

export interface HelloRequest {
  name: string;
}

export interface HelloReply {
  message: string;
}

export interface ByeReply {
  message?: { $case: "bye"; bye: string } | { $case: "byebye"; byebye: string };
}

const baseHelloRequest: object = {
  name: "",
};

const baseHelloReply: object = {
  message: "",
};

const baseByeReply: object = {};

export interface Greeter {
  SayHello(request: HelloRequest): Promise<HelloReply>;

  SayBye(request: HelloRequest): Promise<ByeReply>;
}

export const HelloRequest = {
  encode(message: HelloRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.name);
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): HelloRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseHelloRequest } as HelloRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): HelloRequest {
    const message = { ...baseHelloRequest } as HelloRequest;
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    }
    return message;
  },
  fromPartial(object: DeepPartial<HelloRequest>): HelloRequest {
    const message = { ...baseHelloRequest } as HelloRequest;
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    }
    return message;
  },
  toJSON(message: HelloRequest): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    return obj;
  },
};

export const HelloReply = {
  encode(message: HelloReply, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.message);
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): HelloReply {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseHelloReply } as HelloReply;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.message = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): HelloReply {
    const message = { ...baseHelloReply } as HelloReply;
    if (object.message !== undefined && object.message !== null) {
      message.message = String(object.message);
    }
    return message;
  },
  fromPartial(object: DeepPartial<HelloReply>): HelloReply {
    const message = { ...baseHelloReply } as HelloReply;
    if (object.message !== undefined && object.message !== null) {
      message.message = object.message;
    }
    return message;
  },
  toJSON(message: HelloReply): unknown {
    const obj: any = {};
    message.message !== undefined && (obj.message = message.message);
    return obj;
  },
};

export const ByeReply = {
  encode(message: ByeReply, writer: Writer = Writer.create()): Writer {
    console.log("ByeReply -- encode", message);
    if (message.message?.$case === "bye") {
      writer.uint32(10).string(message.message.bye);
    }
    if (message.message?.$case === "byebye") {
      writer.uint32(18).string(message.message.byebye);
    }
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): ByeReply {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseByeReply } as ByeReply;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.message = { $case: "bye", bye: reader.string() };
          break;
        case 2:
          message.message = { $case: "byebye", byebye: reader.string() };
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): ByeReply {
    const message = { ...baseByeReply } as ByeReply;
    if (object.bye !== undefined && object.bye !== null) {
      message.message = { $case: "bye", bye: String(object.bye) };
    }
    if (object.byebye !== undefined && object.byebye !== null) {
      message.message = { $case: "byebye", byebye: String(object.byebye) };
    }
    return message;
  },
  fromPartial(object: DeepPartial<ByeReply>): ByeReply {
    const message = { ...baseByeReply } as ByeReply;
    if (object.message?.$case === "bye" && object.message?.bye !== undefined && object.message?.bye !== null) {
      message.message = { $case: "bye", bye: object.message.bye };
    }
    if (object.message?.$case === "byebye" && object.message?.byebye !== undefined && object.message?.byebye !== null) {
      message.message = { $case: "byebye", byebye: object.message.byebye };
    }
    return message;
  },
  toJSON(message: ByeReply): unknown {
    const obj: any = {};
    message.message?.$case === "bye" && (obj.bye = message.message?.bye);
    message.message?.$case === "byebye" && (obj.byebye = message.message?.byebye);
    return obj;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | undefined;
type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends { $case: string }
  ? { [K in keyof Omit<T, "$case">]?: DeepPartial<T[K]> } & { $case: T["$case"] }
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;
