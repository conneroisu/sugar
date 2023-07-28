/*
 * Filename: /Users/connerohnesorge/Documents/000Vaults/Sugar Development Vault/.obsidian/plugins/sugar/src/obj/sugar.ts
 * Path: /Users/connerohnesorge/Documents/000Vaults/Sugar Development Vault/.obsidian/plugins/sugar
 * Created Date: Saturday, July 15th 2023, 2:33:46 pm
 * Author: Conner Ohnesorge
 * MIT License
 * Copyright (c) 2023 Conner Ohnesorge
 */

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
	generate_id,
	get_folder_path,
	resolve_tfile,
	resolve_tfolder,
} from "./util";
import {sep} from "path";

export const menu_sep = "";
export const MAXIMUM_ID = 100000;

/**
 * The main workhorse class for the sugar plugin.
 **/
export default class Sugar {
	plugin: SugarPlugin;
	debug: boolean;
	app: App;
	files: TFile[] = [];
	contents: string[] = [];
	fTable: Record<string, TAbstractFile> = {};
	sweetTable: Record<string, TAbstractFile> = {};

	constructor(sugar_plugin: SugarPlugin) {
		this.fTable = {};
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

	async select_entry() {
		// get the cursor position from obsidian editor
		const markdownView = this.getActiveViewOfType();
		if (markdownView) {
			const {editor} = markdownView;
			const cursor = editor.getCursor();
			const line = editor.getLine(cursor.line);
			const line_text = line.slice(0, undefined);
			const id = this.parse_id(line_text);
			// search the  table for the id found in the line

			if (this.debug) {
				console.log("Sugar: Selecting Entry with ID: " + id);
			}
			if (!this.fTable[id] && this.debug) {
				console.log("Sugar: Failed Find ID: " + id);
			}

			// if the file is a TFolder open the directory in a sugar file
			if (this.fTable[id] instanceof TFolder) {
				if (this.debug) {
					console.log(
						"Sugar: Opening Folder: " + this.fTable[id].path
					);
				}
				this.getLatentSugarFile(
					this.fTable[id].path + sep + "sug"
				).then((latent_file) => {
					this.app.workspace
						.getMostRecentLeaf()
						?.openFile(latent_file, {active: true});
				});
				return;
			}

			if (this.debug) {
				console.log("Sugar Opening File: " + this.fTable[id].path);
			}

			this.app.workspace
				.getMostRecentLeaf()
				?.openFile(this.fTable[id] as TFile),
			{
				active: true,
			};
		}
	}

	async open_sugar(): Promise<void> {
		// get the active workspace leaf
		let active_file = this.app.workspace.getActiveFile();
		const leaf = this.app.workspace.getMostRecentLeaf();

		let res: null | TFolder | TFile = null;
		if (this.debug) {
			console.log("Sugar: Opening Sugar For: " + active_file?.path);
		}

		if (active_file != null) {
			if (
				this.is_sugar_file(active_file.path) &&
				active_file.parent != null
			) {
				const vault_file = await this.GetVaultFile(
					active_file.parent.path
				);
				if (vault_file != null) {
					res = resolve_tfolder(vault_file.path);
				}
			}
			if (!res) {
				res = active_file;
			}
			active_file = await this.getLatentSugarFile(res.path);
			await leaf?.openFile(active_file, {active: true});
			this.files.push(active_file);
			this.contents.push(await this.app.vault.cachedRead(active_file));
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

		const latent_sugar_file_path = this.plugin.settings.sugar_directory + sep + "∆" + path + ".sugar";

		try {
			if (this.debug) {console.log("Sugar: Attemping Creation Latent Sugar File");}

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
		this.sweetTable[generate_id(this.sweetTable)] = latent_sugar_file;
		if (this.debug) {
			console.log(
				"Sugar: Added Latent Sugar File to Sweet Table. It is: " +
				latent_sugar_file.path
			);
		}
		return latent_sugar_file;
	}

	/**
	 *  gets the string of a path/parent-path of open sugar view from a latent sugar file
	 **/
	async GetVaultFile(file_path: string): Promise<TFile | TFolder | null> {
		file_path = normalizePath(file_path);
		let path: string = file_path.replace("^", sep);
		path = path.replace(this.plugin.settings.sugar_directory + sep, "");
		return resolve_tfolder(path.replace("∆", "").replace(".sugar", ""));
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
		this.parse_delete();
		this.parse_move();
		this.parse_copy();
		this.parse_create();
		this.parse_rename();
	}
	parse_copy() {
		throw new Error("Method not implemented.");
	}
	/** 
	 * Parses the sugar file for moving of files by using the sweet Table 
	 **/
	parse_move() {
		throw new Error("Method not implemented.");
	}
	/**
	 * Parses the sugar file for creation of files by using the sweet Table
	 **/
	parse_create() {
		throw new Error("Method not implemented.");
	}
	/** 
	 * Parses the sugar file for renaming of files by using the sweet Table
	 **/
	parse_rename() {
		throw new Error("Method not implemented.");
	}

	/**
	 * Creates a list of all the files in a folder given a file path within the obsidian vault
	 **/
	async create_content_list(file_path: string): Promise<string> {
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
						const generated_id = generate_id(this.fTable);
						const res = resolve_tfolder(file.path);
						if (res != null && res instanceof TFolder) {
							this.fTable[this.parse_id(generated_id)] = res;
						}
						files_paths.unshift(
							"∆" + generated_id + menu_sep + file.path + sep
						);
						files.unshift(file);
					} else {
						const generated_id = generate_id(this.fTable);
						this.fTable[this.parse_id(generated_id)] = file;
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
		for (const key in this.fTable) {
			const value = this.fTable[key];
			const res = resolve_tfolder(value.path);
			if (res != null && res instanceof TFile) {
				const contents = await this.app.vault.cachedRead(res);
				if (!contents.contains(key)) {
					this.app.vault.delete(value);
					this.plugin.sugar_position_memory.deleteFile(value);
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
				this.plugin.sugar_position_memory.deleteFile(file);
			}
		}
		// get all the folders
		const subfolders = folder.children.filter(
			(child): child is TFolder => child instanceof TFolder
		);
		for (const subfolder of subfolders) {
			if (subfolder.path.startsWith(folder.path)) {
				await this.app.vault.delete(subfolder);
			}
		}
	}

	async getAllFolders(): Promise<TFolder[]> {
		const folders: TFolder[] = [];
		const files = this.app.vault.getMarkdownFiles();
		for (const file of files) {
			const {parent} = file;
			if (parent instanceof TFolder && !folders.includes(parent)) {
				folders.push(parent);
			}
		}
		return folders;
	}

	/**
	 * Method that determines if a file is with the sugar directory given a file path
	 **/
	is_sugar_file(file_path: string): boolean {
		if (file_path.includes("sugar")) {
			return true;
		}
		return false;
	}

	/**
	 * Method that reloads the sugar view for the current sugar file
	 **/
	async reload_sugar(): Promise<void> {
		// get the active workspace getMostRecentLeaf
		const file = this.app.workspace.getActiveFile();

		if (file) {
			if (this.debug) {
				console.log("Sugar: Reloading Sugar View for: " + file.path);
			}
			// modify the content of the current sugar file
			this.app.vault.modify(file, "");
			const path = await this.GetVaultFile(
				file.path.replace(
					this.plugin.settings.sugar_directory + sep,
					""
				)
			);
			if (path == null) {
				return;
			}
			const content = await this.create_content_list(path.path);

			if (this.debug) {
				console.log("Sugar: Content for: " + path + " is: " + content);
				console.log(
					"Sugar: Content for: " + file.path + " is: " + content
				);
			}
			this.app.vault.append(file, content);
		}
	}

	/**
	 * 
	 * Prints the contents of the sugar fTable
	 * Additionally finishes by printing if there are duplicates
	 **/
	print_fTable(): void {
		console.log("Printing F Table");
		console.log("=============================================");
		const record: string[] = [];
		for (const key in this.fTable) {
			const value = this.fTable[key];
			console.log(key + " : " + value.path);
			record.push(value.path);
			record.forEach((element) => {
				if (record.indexOf(element) != record.lastIndexOf(element)) {
					console.log("Duplicate: " + element);
				}
			});
		}
	}
	/**
	 * Prints the contents of the sugar fTable
	 * Additionally finishes by printing if there are duplicates
	 **/
	print_sweetTable(): void {
		console.log("Printing Sweet Table");
		console.log("=============================================");
		const record: string[] = [];
		for (const key in this.fTable) {
			const value = this.sweetTable[key];
			console.log(key + " : " + value.path);
			record.push(value.path);
			record.forEach((element) => {
				if (record.indexOf(element) != record.lastIndexOf(element)) {
					console.log("Duplicate: " + element);
				}
			});
		}
	}
}
