import {
	normalizePath,
	addIcon,
	getIcon,
	TAbstractFile,
	TFile,
	TFolder,
} from "obsidian";
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
/**
 * Creates a list of all the files in a folder given a file path within the obsidian vault
 **/
export function create_content_list(file_path: string): string {
	file_path = normalizePath(file_path);
	// remove the file name and extension from the end of the file path
	let folder_path = file_path.substring(0, file_path.lastIndexOf(path.sep));
	// if the file path is at the root of the vault(doesn't have any seps), set it to /
	folder_path = get_folder_path(file_path);

	// create a TFolder fo rthe folder path
	const files: TAbstractFile[] = [];
	const files_paths: string[] = [];

	const folder: TFolder = this.app.vault.getAbstractFileByPath(
		folder_path
	) as TFolder;

	folder.children.forEach((file) => {
		if (file instanceof TAbstractFile) {
			// if the file is a folder insert a / at the end and insert at the beginning of the files
			if (file instanceof TFolder) {
				files_paths.unshift(file.path + path.sep);
				files.unshift(file);
			} else {
				files_paths.push(file.path);
				files.push(file);
			}
		}
	});

	//const SFiles = files_paths.join("\n"); // the string of files_paths
	//const separator = "   "; // the separator between the file and it's logo
	// const icon = [];

	// files.forEach((file) => {
	// // gets the end of the extension of the file
	// 	logos = get_icon(file.path.substring(file.path.lastIndexOf(".")));
	// }

	const content = "";

	return files_paths.join("\n");
}

// function get_icon(file_extension: string): any {

// 	// the list of icons using getIcon
// 	const markdown = getIcon("markdown"),

// 	// if the file extension is not in the list of icons, return the default icon
// 	if (!(file_extension in icons)) {
// 		return icons["default"];
// 	} else {
// 		return icons[file_extension];
// 	}

// }
