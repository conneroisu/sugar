import { SugarView, SUGAR_VIEW_TYPE } from "./view";
import { normalizePath, TFile, View } from "obsidian";
import * as fs from "fs";
import * as path from "path";
import SugarPlugin from "src/main";

/**
 * Retrieves the/a active sugar view
 **/
export function getASugarView(path: string): SugarView {
	if (this.app.workspace.getLeavesOfType(SUGAR_VIEW_TYPE).length === 0) {
		return new SugarView(this.app.workspace.getLeaf(true), this, path);
	}
	return this.app.workspace.getLeavesOfType(SUGAR_VIEW_TYPE)[0]
		.view as SugarView;
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

export function create_content_list(
	file_path: string,
	_plugin: SugarPlugin
): string {
	let folder_path = normalizePath(file_path);
	// if the file path is at the root of the vault(doesn't have any seps), set it to /
	if (folder_path.indexOf(path.sep) === -1) {
		folder_path = path.sep;
	} else {
		//remove the last characters before the last sep
		folder_path = file_path.substring(0, file_path.lastIndexOf(path.sep));
	}
	console.log("file path: " + folder_path);
	const files = fs.readdirSync(folder_path);
	let result = "";
	// combine the files into a single string with newlines
	for (let i = 0; i < files.length; i++) {
		result = files[i] + "\n";
	}
	return result;
}
