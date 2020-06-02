import {IProjectService} from "./IProjectService";
import branch from "git-branch";
import { logError, logDetail } from "../../utils";


export class GitProjectService implements IProjectService {
    async getBranch(file: string): Promise<string> {
        try {
            if (!file)
                return null;
            return await branch(file)
        }
        catch (e) {
            logDetail(e);
            return null;
        }
    }

}
