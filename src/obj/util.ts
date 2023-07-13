import {SugarView, SUGAR_VIEW_TYPE} from "./view";
import {View} from "obsidian";

/** 
 * Retrieves the/a active sugar view 
 **/
export function getASugarView(path: string): SugarView {
	if (this.app.workspace.getLeavesOfType(SUGAR_VIEW_TYPE).length === 0) {
		return new SugarView(this.app.workspace.getLeaf(true), this, path)
	}
	return this.app.workspace.getLeavesOfType(SUGAR_VIEW_TYPE)[0].view as SugarView;
}

/** 
 * Gets the current sugar view if there is one 
 **/
export function getSugarPath(): View {
	return this.app.workspace.getLeavesOfType(SugarView)[0].view as SugarView;
}

