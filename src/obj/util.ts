import {SugarView, SUGAR_VIEW_TYPE} from "./view";
import {normalizePath, TFile, View} from "obsidian";

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

/** 
 * Gives a TFile for a given vault path 
 **/
export function resolve_tfile(file_str: string): TFile {
	file_str = normalizePath(file_str);

	const file = app.vault.getAbstractFileByPath(file_str);
	if (!file) {
		throw new Error(`File "${file_str}" doesn't exist`);
	}
	if (!(file instanceof TFile)) {
		throw new Error(`${file_str} is a folder, not a file`);
	}

	return file;
}
