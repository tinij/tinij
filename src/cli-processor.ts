import {Tinij} from "./tinij";
import {PluginTypeEnum} from "./enums/PluginTypeEnum";
import {CategoryEnum} from "./enums/CategoryEnum";

export class CliProcessor {

    protected tinijClient: Tinij;

    constructor() {
        this.tinijClient = new Tinij();
    }

    public async initService(): Promise<void> {
        await this.tinijClient.initServices();
    }

    public async setApiKey(key: string) : Promise<void> {
        let result = await this.tinijClient.setApiKey(key);
        if (result == true) {
            console.log("API key set successfully")
        } else {
            console.log("Failed to set API key");
        }
    }

    public trackActivity(plugin: string,
                          time: string,
                          entity: string,
                          category: string,
                          is_write?: string,
                          project?: string,
                          branch?: string,
                          lineNumber?: string,
                          type?: string) {
        this.tinijClient.trackActivity(parseInt(plugin), parseInt(time), entity, parseInt(category), is_write == "true", project, branch, parseInt(lineNumber), parseInt(type));
    }

    private getSummary() {
        console.log("GET summary");
    }
}
