import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { Command } from './command.interface.js';

export class ImportCommand implements Command {
  public getName(): string {
    return '--import';
  }

  public execute(...parameters: string[]): void {
    const [fileName] = parameters;
    const fileReader = new TSVFileReader(fileName.trim());

    try {
      fileReader.read();
      console.log(fileReader.toArray());
    } catch (error) {
      if  (!(error instanceof Error)) {
        throw error;
      }

      console.error(`Can't import data from file: ${fileName}`);
      console.error(`Details: ${error.message}`);
    }
  }
}
