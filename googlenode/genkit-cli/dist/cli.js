"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startCLI = void 0;
const plugin_1 = require("@genkit-ai/tools-common/plugin");
const utils_1 = require("@genkit-ai/tools-common/utils");
const commander_1 = require("commander");
const config_1 = require("./commands/config");
const eval_extract_data_1 = require("./commands/eval-extract-data");
const eval_flow_1 = require("./commands/eval-flow");
const eval_run_1 = require("./commands/eval-run");
const flow_batch_run_1 = require("./commands/flow-batch-run");
const flow_run_1 = require("./commands/flow-run");
const plugins_1 = require("./commands/plugins");
const start_1 = require("./commands/start");
const ui_start_1 = require("./commands/ui-start");
const ui_stop_1 = require("./commands/ui-stop");
const version_1 = require("./utils/version");
const commands = [
    ui_start_1.uiStart,
    ui_stop_1.uiStop,
    flow_run_1.flowRun,
    flow_batch_run_1.flowBatchRun,
    eval_extract_data_1.evalExtractData,
    eval_run_1.evalRun,
    eval_flow_1.evalFlow,
    config_1.config,
    start_1.start,
];
async function startCLI() {
    commander_1.program
        .name('genkit')
        .description('Genkit CLI')
        .version(version_1.version)
        .hook('preAction', async (_, actionCommand) => {
        await (0, utils_1.notifyAnalyticsIfFirstRun)();
        const commandNames = commands.map((c) => c.name());
        let commandName;
        if (commandNames.includes(actionCommand.name())) {
            commandName = actionCommand.name();
        }
        else if (actionCommand.parent &&
            commandNames.includes(actionCommand.parent.name())) {
            commandName = actionCommand.parent.name();
        }
        else {
            commandName = 'unknown';
        }
        await (0, utils_1.record)(new utils_1.RunCommandEvent(commandName));
    });
    for (const command of commands)
        commander_1.program.addCommand(command);
    for (const command of await (0, plugins_1.getPluginCommands)())
        commander_1.program.addCommand(command);
    for (const cmd of plugin_1.ToolPluginSubCommandsSchema.keyof().options) {
        const command = await (0, plugins_1.getPluginSubCommand)(cmd);
        if (command) {
            commander_1.program.addCommand(command);
        }
    }
    commander_1.program.addCommand(new commander_1.Command('help').action(() => {
        utils_1.logger.info(commander_1.program.help());
    }));
    commander_1.program.action(() => {
        utils_1.logger.info(commander_1.program.help());
    });
    await commander_1.program.parseAsync();
}
exports.startCLI = startCLI;
//# sourceMappingURL=cli.js.map