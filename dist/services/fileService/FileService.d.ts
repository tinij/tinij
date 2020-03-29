import { IFileService } from "./IFileService";
export declare class FileService implements IFileService {
    getLinesCount(entity: string): Promise<number>;
}
