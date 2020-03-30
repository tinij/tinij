export interface IProjectService {
    getBranch(file: string) : Promise<string>;
}
