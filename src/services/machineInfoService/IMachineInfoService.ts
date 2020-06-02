import { PlatformTypeEnum } from "../../enums/PlatformTypeEnum";

export interface IMachineInfoService {
    getMachineInfo() : MachineInfo;
}

export class MachineInfo {
    operationSystem: PlatformTypeEnum;
    machineName: string;
}
