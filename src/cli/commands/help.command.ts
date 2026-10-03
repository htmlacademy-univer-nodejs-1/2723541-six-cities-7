import { Command } from './command.interface.js';
import chalk from 'chalk';

export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(`
${chalk.bold.cyan('Программа для подготовки данных для REST API сервера.')}

${chalk.yellow('Пример:')} cli.js --<command> [--arguments]

${chalk.bold('Команды:')}

 ${chalk.green('--version')}                    # выводит номер версии
 ${chalk.green('--help')}                       # печатает этот текст
 ${chalk.green('--import <path>')}              # импортирует данные из TSV
 ${chalk.green('--generate <n> <path> <url>')}  # генерирует тестовые данные
`);
  }
}
