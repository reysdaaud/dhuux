"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uiStop = void 0;
const utils_1 = require("@genkit-ai/tools-common/utils");
const axios_1 = __importDefault(require("axios"));
const clc = __importStar(require("colorette"));
const commander_1 = require("commander");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
exports.uiStop = new commander_1.Command('ui:stop')
    .description('stops any running Genkit Developer UI in this directory')
    .action(async () => {
    const serversDir = await (0, utils_1.findServersDir)();
    const toolsJsonPath = path_1.default.join(serversDir, 'tools.json');
    try {
        const toolsJsonContent = await promises_1.default.readFile(toolsJsonPath, 'utf-8');
        const serverInfo = JSON.parse(toolsJsonContent);
        if ((0, utils_1.isValidDevToolsInfo)(serverInfo)) {
            try {
                await axios_1.default.get(`${serverInfo.url}/api/__health`);
            }
            catch {
                await promises_1.default.unlink(toolsJsonPath);
                utils_1.logger.info('Genkit Developer UI is not running in this directory.');
                return;
            }
            try {
                utils_1.logger.info('Stopping...');
                await axios_1.default.post(`${serverInfo.url}/api/__quitquitquit`);
                if (await (0, utils_1.waitUntilUnresponsive)(serverInfo.url)) {
                    await promises_1.default.unlink(toolsJsonPath);
                    utils_1.logger.info(clc.green('\n  Genkit Developer UI is stopped.'));
                    utils_1.logger.info('  To start the UI, run `genkit ui:start`.\n');
                }
                else {
                    utils_1.logger.info('Failed to stop running UI before timing out.');
                }
            }
            catch {
                utils_1.logger.info('Failed to stop Genkit Developer UI.');
            }
        }
        else {
            utils_1.logger.debug('tools.json is malformed.');
            await promises_1.default.unlink(toolsJsonPath);
            utils_1.logger.info('Genkit Developer UI is not running in this directory.');
        }
    }
    catch {
        utils_1.logger.info('Genkit Developer UI is not running in this directory.');
    }
});
//# sourceMappingURL=ui-stop.js.map