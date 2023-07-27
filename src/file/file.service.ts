import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import * as path from "path";
import * as fs from "fs";
import { ExceptionHandler } from "@nestjs/core/errors/exception-handler";

@Injectable()
export class FileService {
  public async save(file: Express.Multer.File): Promise<string> {
    try {
      const originalName = file.originalname;
      const name = randomUUID() + path.extname(originalName);

      const filePath = path.resolve(__dirname, "..", "storage");

      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }

      fs.writeFileSync(path.join(filePath, name), file.buffer);

      return name;
    } catch (e) {
      throw new ExceptionHandler();
    }
  }
}
