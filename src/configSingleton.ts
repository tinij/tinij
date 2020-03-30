import {UserInfoEntity} from "./entities/UserInfoEntity";
import {logError} from "./utils";

let config = require('./config.json');

export class ConfigSingleton {

    private static instance: ConfigSingleton;
    private userAgent: string;

    private constructor() {
    }

    static getInstance(): ConfigSingleton {
        if (!ConfigSingleton.instance) {
            ConfigSingleton.instance = new ConfigSingleton();
        }
        return ConfigSingleton.instance;
    }

    private userInfo: UserInfoEntity;

    public GetTrackActivityUrl() : string
    {
        return config.trackActivityURL;
    }

    public SetUserToken(key: string) : void {
        this.userInfo = new UserInfoEntity();
        this.userInfo.apiKey = key;
    }

    public GetUserAgent() {
        if (this.userAgent == null)
            return "TINIJ Client";
        return this.userAgent;
    }

    public SetUserAgent(userAgent: string) {
        this.userAgent = userAgent;
    }

    public GetApiKey() : string {
        if (this.userInfo == null) {
            logError("API KEY NOT SET");
        }
        return this.userInfo.apiKey;
    }

}
