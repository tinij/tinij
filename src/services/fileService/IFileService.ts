export interface IFileService {
    getLinesCount(entity: string) : Promise<number>
}
