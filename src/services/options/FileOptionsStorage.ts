import { IOptionsStorage } from "./IOptionsStorage";
import { promises as fsPromises, copyFile } from 'fs';
import fs from 'fs';
import { logError } from "../../utils";
import AsyncLock from "async-lock";
let config = require('../../config.json');

export class FileOptionsStorage implements IOptionsStorage {

    private memCache : {[k: string]: any} = {};
    private path: string;
    private lock: AsyncLock;

    constructor() {
        this.lock  = new AsyncLock();
    }

    async setOption(key: string, value: string): Promise<boolean> {
        this.memCache[key] = value;
        try {
            let config = await fsPromises.readFile(this.path, { encoding: "utf8" });
            let parsedConfig: {[k: string]: any} = {};
            if (config != null) {
                parsedConfig = JSON.parse(config);
            }
            parsedConfig[key] = value;
            await fsPromises.writeFile(this.path, JSON.stringify(parsedConfig), { encoding: "utf8" });
            return true;
        } catch(err) {
            logError("Can't save config: " + err);
            return false;
        }
    }

    async getOption(key: string): Promise<string> {
        if (this.memCache != null && this.memCache[key] != null) {
            return this.memCache[key];
        }
        try {
            let newConfig = await fsPromises.readFile(this.path, { encoding: "utf8" });
            if (newConfig == null) {
                return config[key];
            }
            let parsedConfig = JSON.parse(newConfig);
            this.memCache[key] = parsedConfig[key];
            return parsedConfig[key];
        } catch(err) {
            logError("Can't get config: " + err);
            return config[key];
        }
    }

    async initService(path: string, force: boolean): Promise<boolean> {
        this.path = path;
        return new Promise((resolve, reject) => {
            try {
                fs.exists(path, async (exist) => {
                    var needToRewrite = !exist;
                    if (exist) {
                        let configPath = await fsPromises.readFile(path, { encoding: "utf8" });
                        if (configPath == null || configPath == "")
                            needToRewrite = true
                        else {
                            try {
                                var file = JSON.parse(configPath);
                                if (file == null)
                                    needToRewrite = true;
                            } catch (err) {
                                logError("Corrupted file");
                                needToRewrite = true;
                            }
                        }
                    }

                    if (needToRewrite || force) {
                        var configParsed = await fsPromises.readFile(require.resolve("../../config.json"));
                        fs.writeFile(path, configParsed, 'utf8', (err) => {
                            if (err == null) {
                                return resolve(true);
                            }
                            else {
                                logError("Error init file config. Error code: " + err);
                                return resolve (false)
                            }
                        });
                    }
                    return resolve(true);
                });
            } catch (err) {
                logError("Exception during file init: " + err);
                return resolve(false);
            }
        });
    }
}

