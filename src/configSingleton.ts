import {UserInfoEntity} from "./entities/UserInfoEntity";
import {logError} from "./utils";

let config = require('./config.json');

export class ConfigSingleton {
    private static instance: ConfigSingleton;

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

    public GetApiKey() : string {
        if (this.userInfo == null) {
            logError("API KEY NOT SET");
        }
        return this.userInfo.apiKey;
    }

}
