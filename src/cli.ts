import { CliProcessor } from "./cli-processor";
import { program } from 'commander';
import {PluginTypeEnum} from "./enums/PluginTypeEnum";
import {CategoryEnum} from "./enums/CategoryEnum";

console.log("Tinij CLI tool");

let processor = new CliProcessor();

async function InitCLI() {
    await processor.initService();
    program
        .version('0.0.1')
        .description("TiniJ cli tool")
        .requiredOption('[-k, --key <key>]', 'Set TiniJ key');

    program
        .command('track')
        .arguments('<plugin> <time> <entity> [category] [is_write] [project] [branch] [lineNumber] [type]')
        .description('Track activity')
        .action(async (plugin: string,
                 time: string,
                 entity: string,
                 category: string,
                 is_write?: string,
                 project?: string,
                 branch?: string,
                 lineNumber?: string,
                 type?: string,
                 args?: any) => {
            await processor.setApiKey(args.parent.key);
            processor.trackActivity(plugin, time, entity, category, is_write, project, branch, lineNumber, type)
        });

    if (!process.argv.slice(2).length) {
        program.outputHelp();
    }

    program.parse(process.argv);
}

InitCLI();
