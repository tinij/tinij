import {IMachineInfoService, MachineInfo} from "./IMachineInfoService";
import * as os from "os";
import { PlatformTypeEnum } from "../../enums/PlatformTypeEnum";

export class MachineInfoService implements IMachineInfoService{
    private readonly cachedMachineInfo: MachineInfo;

    getMachineInfo(): MachineInfo {

        if (this.cachedMachineInfo != null)
            return this.cachedMachineInfo;

        let machineName = os.hostname();
        let operationSystem = os.platform();

        let machineInfo = new MachineInfo();
        machineInfo.machineName = machineName;

        switch (operationSystem) {
            case "aix":
                machineInfo.operationSystem = PlatformTypeEnum.Unix;
                break;
            case "darwin":
                machineInfo.operationSystem = PlatformTypeEnum.MacOS;
                break;
            case "freebsd":
                machineInfo.operationSystem = PlatformTypeEnum.FreeBSD;
                break;
            case "linux":
                machineInfo.operationSystem = PlatformTypeEnum.Linux;
                break;
            case "openbsd":
                machineInfo.operationSystem = PlatformTypeEnum.OpenBSD;
                break;
            case "sunos":
                machineInfo.operationSystem = PlatformTypeEnum.Solaris;
                break;
            case "win32":
                machineInfo.operationSystem = PlatformTypeEnum.Windows;
                break;
        }
        return machineInfo;
    }
}
