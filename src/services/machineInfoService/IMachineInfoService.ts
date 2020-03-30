export interface IMachineInfoService {
    getMachineInfo() : MachineInfo;
}

export class MachineInfo {
    operationSystem: string;
    machineName: string;
}
