import path from "path";
import { loadSync } from "@grpc/proto-loader";

export function loadProtoToPackageDefinition() {
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
  const packageDefinition = loadSync(PROTO_PATH, PROTO_OPTIONS);
  return packageDefinition;
}
