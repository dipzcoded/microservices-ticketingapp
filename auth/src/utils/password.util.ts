import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

// turning scrypt to an async and await func rather than a callback func
const scryptAsync = promisify(scrypt);

export class Password {
  constructor() {}
  static async toHash(password: string) {
    const salt = randomBytes(8).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
  }

  static async compare(storedPassword: string, bodyPassword: string) {
    const [hashPassword, salt] = storedPassword.split(".");
    const buf = (await scryptAsync(bodyPassword, salt, 64)) as Buffer;
    return buf.toString("hex") === hashPassword;
  }
}
