import {IProjectService} from "./IProjectService";
import {GitProjectService} from "./GitProjectService";

export class BaseProjectService implements IProjectService{

    private gitProjectService: IProjectService;

    constructor() {
        this.gitProjectService = new GitProjectService();
    }

    getBranch(file: string): Promise<string> {
        return this.gitProjectService.getBranch(file);
    }

}
