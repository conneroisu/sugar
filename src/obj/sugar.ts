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
	resolve_tfolder,
} from "./util";
import { sep } from "path";

export const menu_sep = "";

/**
 * The main workhorse class for the sugar plugin.
 **/
export default class Sugar {
	plugin: SugarPlugin;
	debug: boolean;
	app: App;
	files: TFile[] = [];
	contents: string[] = [];
	sweetTable: Record<string, TAbstractFile> = {};

	constructor(sugar_plugin: SugarPlugin) {
		this.plugin = sugar_plugin;
		this.app = this.plugin.app;
		this.debug = this.plugin.settings.debug;
		ensure_sugar_directory(
			this.plugin.settings.sugar_directory,
			this.app.vault
		);
		deleteOldSugarFiles(
			this.app.vault,
			this.plugin.settings.sugar_directory
		);
	}

	async reload_sugar(): Promise<void> {
		// get the active workspace getMostRecentLeaf
		const file = this.app.workspace.getActiveFile();

		if (file) {
			if (this.debug) {
				console.log("Sugar: Reloading Sugar View for: " + file.path);
			}
			// modify the content of the current sugar file
			this.app.vault.modify(
				file,
				""
			);
			const path = await this.getParentForLatentSugarFile(file.path.replace(this.plugin.settings.sugar_directory + sep, ""));
			const content = await this.create_content_list(path);

			if (this.debug) {
				console.log("Sugar: Content for: " + path + " is: " + content);
				console.log("Sugar: Content for: " + file.path + " is: " + content);
			}
			this.app.vault.append(file, content);
		}
	}

	async select_entry() {
		// get the cursor position from obsidian editor
		const markdownView = this.getActiveViewOfType();
		if (markdownView) {
			const { editor } = markdownView;
			const cursor = editor.getCursor();
			const line = editor.getLine(cursor.line);
			const line_text = line.slice(0, undefined);
			const id = this.parse_id(line_text);
			// search the  table for the id found in the line

			if (this.debug) {
				console.log("Sugar: Selecting Entry with ID: " + id);
			}
			if (!this.sweetTable[id] && this.debug) {
				console.log("Sugar: Failed Find ID: " + id);
			}

			// if the file is a TFolder open the directory in a sugar file
			if (this.sweetTable[id] instanceof TFolder) {
				if (this.debug) {
					console.log(
						"Sugar: Opening Folder: " + this.sweetTable[id].path
					);
				}
				this.getLatentSugarFile(
					this.sweetTable[id].path + sep + "sug"
				).then((latent_file) => {
					this.app.workspace
						.getMostRecentLeaf()
						?.openFile(latent_file, { active: true });
				});
				return;
			}

			if (this.debug) {
				console.log("Sugar Opening File: " + this.sweetTable[id].path);
			}

			this.app.workspace
				.getMostRecentLeaf()
				?.openFile(this.sweetTable[id] as TFile),
			{
				active: true,
			};
		}
	}

	async open_sugar(): Promise<void> {
		// get the active workspace leaf
		const file_path = this.app.workspace.getActiveFile();
		const leaf = this.app.workspace.getMostRecentLeaf();

		if (this.debug) {
			console.log("Sugar: Opening Sugar For: " + file_path?.path);
		}

		if (file_path) {
			const latent_sugar_file = await this.getLatentSugarFile(
				file_path.path
			);
			await leaf?.openFile(latent_sugar_file, { active: true });
			this.files.push(latent_sugar_file);
			this.contents.push(
				await this.app.vault.cachedRead(latent_sugar_file)
			);
		}

		if (this.debug) {
			console.log("Sugar: Opened Path For: " + file_path?.path);
		}
	}

	/**
	 * Gets the latent sugar file for a given file path
	 **/
	async getLatentSugarFile(file_path: string): Promise<TFile> {
		if (this.debug) {
			console.log("Sugar: Getting Latent Sugar File for: " + file_path);
		}

		file_path = normalizePath(file_path);
		const path: string = file_path.replace(sep, "^");
		if (this.debug) {
			console.log(
				"Sugar: Modified File Path from: " + file_path + " to: " + path
			);
		}
		let latent_sugar_file: TFile;

		const latent_sugar_file_path =
			this.plugin.settings.sugar_directory + sep + "∆" + path + ".sugar";

		try {
			if (this.debug) {
				console.log("Sugar: Attemping Creation Latent Sugar File");
			}

			latent_sugar_file = await this.app.vault.create(
				latent_sugar_file_path,
				await this.create_content_list(file_path)
			);
		} catch (AlreadyExistsError) {
			if (this.debug) {
				console.log("Sugar: Sugar File Already Exists");
			}
			latent_sugar_file = resolve_tfile(latent_sugar_file_path);
		}

		if (this.debug) {
			console.log(
				"Sugar: Got Latent Sugar File for: " +
				file_path +
				". It is: " +
				latent_sugar_file.path
			);
		}
		return latent_sugar_file;
	}

	/**
	 *  gets the string of a path/parent-path of open sugar view from a latent sugar file
	 **/
	async getParentForLatentSugarFile(file_path: string): Promise<string> {
		file_path = normalizePath(file_path);
		const path: string = file_path.replace("^", sep);
		return path.replace("∆", "").replace(".sugar", "");
	}

	/**
	 * Saves actions takes within the sugar file
	 **/
	async save_sugar(): Promise<void> {
		const file = this.app.workspace.getActiveFile();
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
		const new_content_lines = new_content.split("\n");
		const old_content_lines = old_content.split("\n");
		if (new_content_lines.length > old_content_lines.length) {
			// get the file without an id
			const new_file = new_content_lines.filter((line) => {
				// without beginning wiht an id
				return !line.startsWith("∆");
			})[0];
			// create the file
			this.app.vault.create(new_file, "");
		}
		this.parse_delete();
	}

	/**
	 * Creates a list of all the files in a folder given a file path within the obsidian vault
	 **/
	async create_content_list(file_path: string): Promise<string> {
		if (this.debug) {
			console.log("Sugar: Creating Content List for: " + file_path);
		}

		// remove the file name and extension from the end of the file path
		let folder_path = file_path.substring(0, file_path.lastIndexOf(sep));
		folder_path = get_folder_path(file_path);

		const files: TAbstractFile[] = [];
		const files_paths: string[] = [];

		const folder: TFolder | null = this.app.vault.getAbstractFileByPath(
			folder_path
		) as TFolder | null;

		if (folder) {
			folder.children.forEach((file) => {
				if (file instanceof TAbstractFile) {
					// if the file is a folder insert a / at the end and insert at the beginning of the files
					files_paths.push();
					if (file instanceof TFolder) {
						const generated_id = this.generate_id();
						const res = resolve_tfolder(file.path);
						if (res != null && res instanceof TFolder) {
							this.sweetTable[this.parse_id(generated_id)] = res;
						}
						files_paths.unshift(
							"∆" + generated_id + menu_sep + file.path + sep
						);
						files.unshift(file);
					} else {
						const generated_id = this.generate_id();
						this.sweetTable[this.parse_id(generated_id)] = file;
						files_paths.push(
							"∆" + generated_id + menu_sep + file.name
						);
						files.push(file);
					}
				}
			});
		}
		return files_paths.join("\n");
	}

	/**
	 * Generates a random id for a line in a sugar files.
	 **/
	generate_id(): string {
		return (
			"<a href=" +
			Math.random().toString(5).substring(2, 7) +
			">" +
			"</a>"
		);
	}

	/**
	 * Returns the id of a line in a sugar file (within the a href).
	 **/
	parse_id(line: string): string {
		return line.split("<a href=")[1].split(">")[0];
	}

	/**
	 * Returns the active view of the workspace if it is a markdown view.
	 **/
	public getActiveViewOfType() {
		return this.app.workspace.getActiveViewOfType(MarkdownView);
	}

	/**
	 * Parses the sugar file to determine if any files have been deleted and deletes them
	 **/
	async parse_delete(): Promise<void> {
		for (const key in this.sweetTable) {
			const value = this.sweetTable[key];
			const res = resolve_tfolder(value.path);
			if (res != null && res instanceof TFile) {
				const contents = await this.app.vault.cachedRead(res);
				if (!(contents).contains(key)) {
					this.app.vault.delete(value);
				}
			} else if (res != null && res instanceof TFolder) {
				await this.removeFolderContents(res);
			}
		}
	}

	async removeFolderContents(folder: TFolder): Promise<void> {
		const files = this.app.vault.getMarkdownFiles();
		for (const file of files) {
			if (file.parent?.path === folder.path) {
				await this.app.vault.delete(file);
			}
		}
		// get all the folders
		const subfolders = folder.children.filter((child): child is TFolder => child instanceof TFolder);
		for (const subfolder of subfolders) {
			if (subfolder.path.startsWith(folder.path)) {
				await this.removeFolderContents(subfolder);
				await this.app.vault.delete(subfolder);
			}
		}
	}

	async getAllFolders(): Promise<TFolder[]> {
		const folders: TFolder[] = [];
		const files = this.app.vault.getMarkdownFiles();
		for (const file of files) {
			const { parent } = file;
			if (parent instanceof TFolder && !folders.includes(parent)) {
				folders.push(parent);
			}
		}
		return folders;
	}
}
