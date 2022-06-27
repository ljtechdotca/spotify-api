import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

class ConfigBuilder {
  path = resolve(".", "data", "tokens.json");

  read() {
    const configString = readFileSync(this.path, "utf-8");

    const config = JSON.parse(configString);

    return config;
  }

  write(access_token: string, refresh_token: string) {
    const config = this.read();

    const newConfig = JSON.stringify({
      ...config,
      access_token,
      refresh_token,
    });

    writeFileSync(this.path, newConfig);
  }
}

export default ConfigBuilder;
