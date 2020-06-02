import {FakeTinij} from "./fakeMethods/FakeTinij";
import {CategoryEnum, PluginTypeEnum, Tinij} from "../src";

export async function generateTinijTestInstance(countOfActivities: number, customTinij?: FakeTinij, ignoreBranch?: boolean) : Promise<Tinij> {
    let pluginName = PluginTypeEnum.VSCODE;
    let entity = "/Users/alexlobanov/Projects/tinij-project/tinij-base/test/fakeMethods/FakeApiService.ts";
    let category = CategoryEnum.CODING;
    let writeOperation = false;
    let project = "testProject";
    let branch = "testBranch";
    if (ignoreBranch) {
        branch = undefined;
    }
    let lineNumber = 5;

    let tinij = new FakeTinij(false);
    if (customTinij != null) {
        tinij = customTinij;
    }
    await tinij.initServices();
    await tinij.clearRecordedLogs();
    if (countOfActivities != 0) {
        for (let i = 0; i < countOfActivities; i++) {
            await tinij.trackActivity(
                pluginName,
                new Date(),
                entity,
                category,
                writeOperation,
                project,
                branch,
                i);
        }
        await new Promise(resolve =>
            setTimeout(resolve, 10) // allow time to cleanup
        );
    }
    return tinij;
}
