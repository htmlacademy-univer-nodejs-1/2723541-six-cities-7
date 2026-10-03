import chalk from 'chalk';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { Command } from './command.interface.js';

export class ImportCommand implements Command {
  public getName(): string {
    return '--import';
  }

  public execute(...parameters: string[]): void {
    const [fileName] = parameters;

    if (!fileName) {
      console.error(chalk.red('Не указан путь к TSV-файлу'));
      return;
    }

    const fileReader = new TSVFileReader(fileName.trim());

    try {
      fileReader.read();
      const offers = fileReader.toArray();

      console.info(
        chalk.green(`Данные успешно импортированы. Предложений: ${offers.length}`)
      );

      console.info(
        chalk.cyan(JSON.stringify(offers, null, 2))
      );
    } catch (error) {
      if (!(error instanceof Error)) {
        throw error;
      }

      console.error(
        chalk.red(`Can't import data from file: ${fileName}`)
      );

      console.error(
        chalk.redBright(`Details: ${error.message}`)
      );
    }
  }
}
