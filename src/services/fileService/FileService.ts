import {IFileService} from "./IFileService";

export class FileService implements IFileService{
    async getLinesCount(entity: string): Promise<number> {
        return 0;
    }
}
