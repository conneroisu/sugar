import { normalizePath, TAbstractFile, TFile, TFolder } from "obsidian";
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

/**
 * Creates a list of all the files in a folder
 **/
export function create_content_list(file_path: string): string {
	file_path = normalizePath(file_path);
	// remove the file name and extension from the end of the file path
	let folder_path = file_path.substring(0, file_path.lastIndexOf(path.sep));
	// if the file path is at the root of the vault(doesn't have any seps), set it to /
	if (folder_path.indexOf(path.sep) === -1) {
		folder_path = path.sep;
	} else {
		//remove the last characters before the last sep
		folder_path = file_path.substring(0, file_path.lastIndexOf(path.sep));
	}

	// create a TFolder fo rthe folder path
	const files: string[] = [];

	const folder: TFolder = this.app.vault.getAbstractFileByPath(
		folder_path
	) as TFolder;

	folder.children.forEach((file) => {
		if (file instanceof TAbstractFile) {
			// if the file is a folder insert a / at the end and insert at the beginning of the files
			if (file instanceof TFolder) {
				files.unshift(file.path + path.sep);
			} else {
				files.push(file.path);
			}
		}
	});

	return files.join("\n");
}
