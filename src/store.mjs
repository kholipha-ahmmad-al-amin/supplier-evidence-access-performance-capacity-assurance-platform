import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

export class AtomicStore {
  constructor(file) { this.file = file; }
  read() {
    try {
      const data = JSON.parse(readFileSync(this.file, 'utf8'));
      return { accessPerformanceCapacityReviews: Array.isArray(data.accessPerformanceCapacityReviews) ? data.accessPerformanceCapacityReviews : [] };
    } catch (error) {
      if (error.code === 'ENOENT') return { accessPerformanceCapacityReviews: [] };
      throw error;
    }
  }
  write(data) {
    mkdirSync(dirname(this.file), { recursive: true });
    const temporaryPath = `${this.file}.${process.pid}.${Date.now()}.tmp`;
    writeFileSync(temporaryPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
    renameSync(temporaryPath, this.file);
  }
}
