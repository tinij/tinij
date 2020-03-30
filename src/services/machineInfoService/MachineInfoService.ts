import {IMachineInfoService, MachineInfo} from "./IMachineInfoService";
import * as os from "os";

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
                machineInfo.operationSystem = "Unix";
                break;
            case "darwin":
                machineInfo.operationSystem = "MacOS";
                break;
            case "freebsd":
                machineInfo.operationSystem = "FreeBSD";
                break;
            case "linux":
                machineInfo.operationSystem = "Linux";
                break;
            case "openbsd":
                machineInfo.operationSystem = "OpenBSD";
                break;
            case "sunos":
                machineInfo.operationSystem = "Solaris";
                break;
            case "win32":
                machineInfo.operationSystem = "Windows";
                break;
        }
        return machineInfo;
    }
}
