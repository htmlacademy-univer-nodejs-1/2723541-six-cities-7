import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Command } from './command.interface.js';
import chalk from 'chalk';

type PackageJsonConfig = {
  version: string;
};

function isPackageJsonConfig(config: unknown): config is PackageJsonConfig {
  return (
    typeof config === 'object' &&
    config !== null &&
    !Array.isArray(config) &&
    'version' in config &&
    typeof config.version === 'string'
  );
}

export class VersionCommand implements Command {
  constructor(
    private readonly filePath: string = './package.json',
  ) {}

  private readVersion(): string {
    const jsonContent = readFileSync(resolve(this.filePath), 'utf8');
    const importedContent: unknown = JSON.parse(jsonContent);

    if (!isPackageJsonConfig(importedContent)) {
      throw new Error('Failed to parse json content.');
    }

    return importedContent.version;
  }

  public getName(): string {
    return '--version';
  }

  public async execute(..._parameters: string[]): Promise<void> {
    try {
      const version = this.readVersion();
      console.info(chalk.green.bold(version));
    } catch (error: unknown) {
      console.error(
        chalk.red(`Failed to read version from ${this.filePath}`)
      );

      if (error instanceof Error) {
        console.error(chalk.redBright(error.message));
      }
    }
  }
}
