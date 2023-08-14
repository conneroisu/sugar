/*
 * Filename: /Users/connerohnesorge/Documents/000Vaults/Sugar Development Vault/.obsidian/plugins/sugar/src/obj/sugar.ts
 * Path: /Users/connerohnesorge/Documents/000Vaults/Sugar Development Vault/.obsidian/plugins/sugar
 * Created Date: Saturday, July 15th 2023, 2:33:46 pm
 * Author: Conner Ohnesorge
 * MIT License
 * Copyright (c) 2023 Conner Ohnesorge
 */

import SugarPlugin from "../main";
import {
	App,
	MarkdownView,
	normalizePath,
	TAbstractFile,
	TFile,
	TFolder,
} from "obsidian";
import {
	deleteOldSugarFiles as deleteOldSFiles,
	isSugarFile,
	ensure_sugar_directory as ensureSDir,
	get_folder_path,
	resolve_tfile,
	resolve_tfolder,
	parse_id,
	generate_id,
} from "./util";
import {sep} from "path";
import {Action} from "./action";
import {SugarOperationView} from "./ui/view";

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
	actions: Action[] = [];

	/**
	 * The constuctor for the main workhorse class for the sugar plugin.
	 **/
	constructor(sugar_plugin: SugarPlugin) {
		this.fTable = {};
		this.plugin = sugar_plugin;
		this.app = this.plugin.app;
		this.debug = this.plugin.settings.debug;
		ensureSDir(this.plugin.settings.sugar_directory, this.app.vault);
		deleteOldSFiles(this.app.vault, this.plugin.settings.sugar_directory);
	}

	async select_entry() {
		const markdownView = this.getActiveViewOfType();
		if (!markdownView) {
			return;
		}
		const {editor} = markdownView;
		const cursor = editor.getCursor();
		const line = editor.getLine(cursor.line);
		const line_text = line.slice(0, undefined);
		const id = parse_id(line_text);
		// if the file is a TFolder open the directory in a sugar file
		if (this.fTable[id] instanceof TFolder) {
			const lat = await this.getLatentSugarFile(
				this.fTable[id].path + sep + "sug"
			);
			this.app.workspace
				.getMostRecentLeaf()
				?.openFile(lat, {active: true});
			return;
		}
		this.app.workspace
			.getMostRecentLeaf()
			?.openFile(this.fTable[id] as TFile, {active: true});
	}

	async open_sugar(): Promise<void> {
		// get the active workspace leaf
		let active_file = this.app.workspace.getActiveFile();
		const leaf = this.app.workspace.getMostRecentLeaf();

		let res: null | TFolder | TFile = null;

		if (active_file != null) {
			if (isSugarFile(active_file.path) && active_file.parent != null) {
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

	async getLatentSugarFile(file_path: string): Promise<TFile> {
		file_path = normalizePath(file_path);
		const path: string = file_path.replace(sep, "^");
		let latent_sugar_file: TFile;
		const latent_sugar_file_path =
			this.plugin.settings.sugar_directory + sep + "∆" + path + ".sugar";

		latent_sugar_file = await this.app.vault.create(
			latent_sugar_file_path,
			await this.create_content_list(file_path)
		);

		try {
			latent_sugar_file = resolve_tfile(latent_sugar_file_path);
		} catch (error) {
			// get the file from the sugar version of the file
			latent_sugar_file = await this.app.vault.create(
				latent_sugar_file_path,
				await this.create_content_list(file_path)
			);
		}

		this.sweetTable[generate_id(this.sweetTable)] = latent_sugar_file;
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
		new SugarOperationView(this.app, this).open();
		if (file) {
			this.parseSugarContent(file);
		}
	}
	accept_operations(): () => void {
		console.log("accepting operations");
		return () => {
			console.log("accepted operations");
		};
	}

	/**
	 * Reads the sugar file and determines actions that should be taken based on the content
	 **/
	async parseSugarContent(file: TFile) {
		this.parse_delete();
		this.parse_move();
		this.parse_create();
		this.parse_rename();
		this.sort_actions(this.actions);
	}
	/**
	 * Sorts the actions in the sugar class into the order they should be executed
	 * 1. Move
	 * 2. Rename
	 * 3. Create
	 * 4. Delete
	 * @param actions the actions to be sorted
	 */
	sort_actions(actions: Action[]) {
		const result: Action[] = [];
		actions.forEach((action) => {
			if (action.type === "move") {
				result.push(action);
			}
		});
		actions.forEach((action) => {
			if (action.type === "create") {
				result.push(action);
			}
		});
		actions.forEach((action) => {
			if (action.type === "delete") {
				result.push(action);
			}
		});
		return result;
	}

	parse_delete() {
		throw new Error("Method not implemented.");
	}
	parse_move() {
		throw new Error("Method not implemented.");
	}
	parse_create() {
		throw new Error("Method not implemented.");
	}
	parse_rename() {
		throw new Error("Method not implemented.");
	}

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
							this.fTable[parse_id(generated_id)] = res;
						}
						// if the file.path contains a separator replace it with ^
						let content_path = file.path;
						if (content_path.includes(sep)) {
							content_path = content_path.replace(sep, "^");
						}

						files_paths.unshift(
							"∆" + generated_id + menu_sep + content_path + sep
						);
						files.unshift(file);
					} else {
						const generated_id = generate_id(this.fTable);
						this.fTable[parse_id(generated_id)] = file;
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

	public getActiveViewOfType() {
		return this.app.workspace.getActiveViewOfType(MarkdownView);
	}

	async removeFolderContents(folder: TFolder): Promise<void> {
		const files = this.app.vault.getMarkdownFiles();
		for (const file of files) {
			if (file.parent?.path === folder.path) {
				await this.app.vault.delete(file);
				this.plugin.sugar_position_memory.deleteFile(file);
			}
		}
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
	 * Method that reloads the sugar view for the current sugar file
	 **/
	async reload_sugar(): Promise<void> {
		// get the active workspace getMostRecentLeaf
		const file = this.app.workspace.getActiveFile();

		if (file) {
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

			this.app.vault.append(file, content);
		}
	}
}
