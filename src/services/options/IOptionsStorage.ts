export interface IOptionsStorage {
    setOption(key: string, value: string) : Promise<boolean> ;
    getOption(key: string) : Promise<string> ;
    initService(configPath: string, force: boolean) : Promise<boolean>;

}