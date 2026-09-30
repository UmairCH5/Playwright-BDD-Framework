import fs from 'fs';
import path from 'path';

export class FileUtils {
  static readJson<T>(relativePath: string): T {
    const fullPath = path.resolve(process.cwd(), relativePath);
    return JSON.parse(fs.readFileSync(fullPath, 'utf8')) as T;
  }
}
