import { normalizePath, TAbstractFile, TFile, TFolder, Vault } from "obsidian";
import * as path from "path";

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

export function get_folder_path(file_path: string): string {
	// if the file path is at the root of the vault(doesn't have any seps), set it to /
	if (file_path.indexOf(path.sep) === -1) {
		file_path = path.sep;
	} else {
		//remove the last characters before the last sep
		file_path = file_path.substring(0, file_path.lastIndexOf(path.sep));
	}
	return file_path;
}

export function ensure_sugar_directory(sugar_directory: string, vault: Vault) {
	// Upon construction, sugar should ensure that the sugar directory exists
	if (!this.app.vault.getAbstractFileByPath(sugar_directory)) {
		this.app.vault.createFolder(sugar_directory);
	}
}

export function deleteOldSugarFiles(
	vault: Vault,
	sugar_directory: string
): void {
	// Upon cosntuction, sugar should delete all sugar files inside of the sugar_directory
	for (const file of vault.getFiles()) {
		if (file.path.startsWith(sugar_directory)) {
			vault.delete(file);
		}
	}
}
function checkRenamed(line: string): void {}
