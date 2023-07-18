import SugarPlugin from "src/main";
import {
	App,
	MarkdownView,
	normalizePath,
	TAbstractFile,
	TFile,
	TFolder,
} from "obsidian";
import {
	deleteOldSugarFiles,
	ensure_sugar_directory,
	get_folder_path,
	resolve_tfile,
} from "./util";
import {sep} from "path";
export const menu_sep = "    ";
/**
 * The main workhorse class for the sugar plugin
 **/
export default class Sugar {
	plugin: SugarPlugin;
	app: App;
	// an array list of sugar files
	files: TFile[] = [];
	contents: string[] = [];
	fields: string[][] = [];
	active_file: TFile | null = null;
	table: Record<string, string[]> = {};

	constructor(sugar_plugin: SugarPlugin) {
		this.plugin = sugar_plugin;
		this.app = this.plugin.app;
		ensure_sugar_directory(
			this.plugin.settings.sugar_directory,
			this.app.vault
		);
		deleteOldSugarFiles(
			this.app.vault,
			this.plugin.settings.sugar_directory
		);
	}

	public getActiveViewOfType() {
		return this.app.workspace.getActiveViewOfType(MarkdownView);
	}
	select_entry() {
		// get the cursor position from obsidian editor
		const markdownView = this.getActiveViewOfType();
		if (markdownView) {
			const editor = markdownView.editor;
			const cursor = editor.getCursor();
			const line = editor.getLine(cursor.line);
			const line_text = line.slice(0, undefined);
			const id = this.parse_id(line_text);
			// search the  table for the id found in the line

			const path = this.table[id];
			if (path) {
				const file = resolve_tfile(path.toString());
				this.app.workspace.getMostRecentLeaf()?.openFile(file, {
					active: true,
				});
			} else {
				console.log("Could not find entry with id: " + id);
			}
		}
	}

	async open_sugar(): Promise<void> {
		// get the active workspace leaf
		const file_path = this.app.workspace.getActiveFile();
		const leaf = this.app.workspace.getMostRecentLeaf();

		if (file_path) {
			const latent_sugar_file = await this.getLatentSugarFile(
				file_path.path
			);
			leaf?.openFile(latent_sugar_file, {active: true});
			this.files.push(latent_sugar_file);
			this.contents.push(
				await this.app.vault.cachedRead(latent_sugar_file)
			);
		}

		if (this.plugin.settings.debug) {
			console.log("Opened the Sugar File");
		}
	}

	/**
	 * Gets the latent sugar file for a given file path
	 **/
	async getLatentSugarFile(file_path: string): Promise<TFile> {
		file_path = normalizePath(file_path);
		const path: string = file_path.replace(sep, "^");
		let latent_sugar_file: TFile;

		const latent_sugar_file_path =
			this.plugin.settings.sugar_directory + sep + "∆" + path + ".sugar";
		try {
			latent_sugar_file = await this.app.vault.create(
				latent_sugar_file_path,
				await this.create_content_list(file_path)
			);
		} catch (ALREADY_EXISTS) {
			latent_sugar_file = resolve_tfile(latent_sugar_file_path);
		}
		return latent_sugar_file;
	}

	async save_sugar(): Promise<void> {
		// get the active workspace
		const file = this.app.workspace.getActiveFile();
		// const leaf = this.app.workspace.getMostRecentLeaf();
		if (file) {
			this.parseSugarContent(file);
		}
	}
	/**
	 * Reads the sugar file and determines actions that should be taken based on the content
	 **/
	async parseSugarContent(file: TFile) {
		// get the old content of the file by finding the index of the file in the files array
		const old_content = this.contents[this.files.indexOf(file)];
		// get the new content of the file
		const new_content = await this.app.vault.cachedRead(file);

		// if the new_content has a new file name in it, without an id, create the file
		// split the new content by new lines
		const new_content_lines = new_content.split("\n");
		// split the old content by new line
		const old_content_lines = old_content.split("\n");
		// match the old content lines with the new content lines id
		// and if the id is the same, but the file name is not then the file has been renamed
		const matched_lines = {};
		old_content_lines.forEach((oline) => {
			new_content_lines.forEach((nline) => {
				// get the id inside of the a href
				const old_id = oline.match(/(?<=\().*?(?=\))/g);
				const new_id = nline.match(/(?<=\().*?(?=\))/g);
				if (old_id && new_id) {
					if (old_id == new_id) {
						// checkRenamed(old_id, new_id)
					}
				}
			});
		});
		// old_content_lines.forEach((line) => {
		// 	checkRenamed(line);
		// }
		// if the new content has more lines than the old content, then a new file has been added
		if (new_content_lines.length > old_content_lines.length) {
			// get the file without an id
			const new_file = new_content_lines.filter((line) => {
				// without beginning wiht an id
				return !line.startsWith("∆");
			})[0];
			// create the file
			this.app.vault.create(new_file, "");
		}
	}

	/**
	 * Creates a list of all the files in a folder given a file path within the obsidian vault
	 **/
	async create_content_list(file_path: string): Promise<string> {
		// remove the file name and extension from the end of the file path
		let folder_path = file_path.substring(0, file_path.lastIndexOf(sep));
		// if the file path is at the root of the vault(doesn't have any seps), set it to /
		folder_path = get_folder_path(file_path);

		// create a TFolder for the folder path
		const files: TAbstractFile[] = [];
		const files_paths: string[] = [];

		const folder: TFolder = this.app.vault.getAbstractFileByPath(
			folder_path
		) as TFolder;

		folder.children.forEach((file) => {
			if (file instanceof TAbstractFile) {
				// if the file is a folder insert a / at the end and insert at the beginning of the files
				files_paths.push();
				if (file instanceof TFolder) {
					const generated_id = this.generate_id();
					this.table[this.parse_id(generated_id)] = [file.path];
					files_paths.unshift(
						"∆" + generated_id + menu_sep + file.path + sep
					);
					files.unshift(file);
				} else {
					const generated_id = this.generate_id();
					this.table[this.parse_id(generated_id)] = [file.path];
					files_paths.push("∆" + generated_id + menu_sep + file.name);
					files.push(file);
				}
			}
		});

		return files_paths.join("\n");
	}
	generate_id(): string {
		return (
			"<a href=" +
			Math.random().toString(5).substring(2, 7) +
			">" +
			"</a>"
		);
	}
	/**
	 * Returns the id of a line in a sugar file (within the a href)
	 **/
	parse_id(line: string): string {
		return line.split("<a href=")[1].split(">")[0];
	}
}
// function checkRenamed(oline: string, nline: string): void {
// 	if (oline != nline) {
// 		// get all files in teh vault
// 		const files = this.app.vault.getFiles();
// 		// rename the file to the new file name since it has the same id
// 		files.forEach((file) => {

// 		}
// 	}
// }
