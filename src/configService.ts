import {UserInfoEntity} from "./entities/UserInfoEntity";
import {logError} from "./utils";
import * as os from "os";
import * as path from "path";
import { IOptionsStorage } from "./services/options/IOptionsStorage";
import { FileOptionsStorage } from "./services/options/FileOptionsStorage";

let config = require('./config.json');

export class ConfigService {

    private static instance: ConfigService;
    private userAgent: string;
    private userInfo: UserInfoEntity;
    private optionsService: IOptionsStorage;

    private constructor() {
        this.optionsService = new FileOptionsStorage();
    }

    static getInstance(): ConfigService {
        if (!ConfigService.instance) {
            ConfigService.instance = new ConfigService();
        }
        return ConfigService.instance;
    }

    public InitSettingsStorage() : Promise<boolean> {
        return this.optionsService.initService(path.join(this.getHomeLocation(),  config.settingsFile));
    }

    public GetConfigLocation() : string {
        return path.join(this.getHomeLocation(),  config.settingsFile);
    }

    public GetActivityFileLocation() : string {
        return path.join(this.getHomeLocation(),  config.activityLogFile);
    }

    public GetLogFileLocation() : string {
        return path.join(this.getHomeLocation(),  config.logFile);
    }


    public GetTrackActivityUrl() : Promise<string>
    {
        return this.optionsService.getOption("trackActivityURL");
    }

    public async GetDebugLevel() : Promise<number> {
        try {
            return parseInt(await this.optionsService.getOption("debugLevel"), 10);
        } catch (err) {
            console.error(err);
            return 5;
        }
    }

    public async IsMemoryBasedQueue() : Promise<boolean> {
        return (await this.optionsService.getOption("memoryBasedQueue")) == "true";
    }

    public SetUserToken(key: string) : void {
        this.userInfo = new UserInfoEntity();
        this.userInfo.apiKey = key;
        this.optionsService.setOption("apiKey", key);
    }

    public GetUserAgent() {
        if (this.userAgent == null)
            return "TINIJ Client";
        return this.userAgent;
    }

    public SetUserAgent(userAgent: string) {
        this.userAgent = userAgent;
    }

    public async GetApiKey() : Promise<string> {
        return await this.optionsService.getOption("apiKey");
    }

    private getHomeLocation() : string {
        let tinijHome = process.env.TINIJ_HOME;
        if (tinijHome == null) {
            if (os.platform() == "win32") {
                return process.env["USERPROFILE"];
            } else {
                return process.env["HOME"];
            }
        }
        return tinijHome;
    }

}
