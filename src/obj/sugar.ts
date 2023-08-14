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
	deleteOldSugarFiles,
	isSugarFile,
	ensure_sugar_directory,
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
		const markdownView = this.getActiveViewOfType();
		if (!markdownView) {
			return;
		}
		const {editor} = markdownView;
		const cursor = editor.getCursor();
		const line = editor.getLine(cursor.line);
		const line_text = line.slice(0, undefined);
		const id = parse_id(line_text);
		console.log("Selected : " + this.sweetTable[id].path);
		//TODO: open the file that is selected
	}

	async openSugar(): Promise<void> {
		// get the active workspace leaf
		let active_file: TFile | TFolder | null =
			this.app.workspace.getActiveFile();
		const leaf = this.app.workspace.getMostRecentLeaf();
		if (active_file == null) return;
		if (isSugarFile(active_file.path) && active_file.parent != null) {
			const vault_file = await this.GetVaultFile(active_file.parent.path);
			if (vault_file != null) {
				active_file = resolve_tfolder(vault_file.path);
			}
		}
		active_file = await this.getLatentSugarFile(active_file);
		await leaf?.openFile(active_file, {active: true});
	}

	async getLatentSugarFile(abstractFile: TAbstractFile): Promise<TFile> {
		let latent_sugar_file: TFile;
		const latent_sugar_file_path =
			this.plugin.settings.sugar_directory +
			sep +
			abstractFile.path +
			".sugar";

		try {
			latent_sugar_file = await this.app.vault.create(
				latent_sugar_file_path,
				await this.create_content_list(abstractFile)
			);
		} catch (error) {
			latent_sugar_file = resolve_tfile(latent_sugar_file_path);
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
	 * Saves actions takes within the sugar files.
	 **/
	async save_sugar(): Promise<void> {
		const file = this.app.workspace.getActiveFile();
		new SugarOperationView(this.app, this).open();
		if (file) {
			this.parseSugarContent(file);
		}
	}

	/**
	 * Executes the actions that have been accumulated.
	 **/
	accept_operations() {
		this.actions.forEach((action) => {
			try {
				action.execute();
			} catch (error) {
				console.error(error);
				// TODO: add popper to show error next to the line that caused the error
			}
		});
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
			if (action.type.toUpperCase() === "MOVE") {
				result.push(action);
			}
		});
		actions.forEach((action) => {
			if (action.type.toUpperCase() === "CREATE") {
				result.push(action);
			}
		});
		actions.forEach((action) => {
			if (action.type.toUpperCase() === "DELETE") {
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

	async create_content_list(abstractFile: TAbstractFile): Promise<string> {
		const lines: string[] = [];
		if (abstractFile instanceof TFolder) {
			abstractFile.children.forEach((file) => {
				if (this.debug) console.log("file:", file);
				// if the file is a folder insert a / at the end and insert at the beginning of the files
				if (file instanceof TFolder) {
					const generated_id = generate_id(this.fTable);
					const res = resolve_tfolder(file.path);
					if (res != null && res instanceof TFolder) {
						this.fTable[parse_id(generated_id)] = res;
					}
					let content_path = file.path;
					content_path = content_path.replace(sep, "^");

					lines.unshift(
						"∆" + generated_id + menu_sep + content_path + sep
					);
				} else {
					const generated_id = generate_id(this.fTable);
					this.fTable[generated_id] = file;
					lines.push("∆" + generated_id + menu_sep + file.name);
				}
			});
		} else {
			if (abstractFile.parent != null) {
				this.create_content_list(abstractFile.parent);
			} else {
				this.create_content_list(resolve_tfolder("/"));
			}
		}
		return lines.join("\n");
	}

	public getActiveViewOfType() {
		return this.app.workspace.getActiveViewOfType(MarkdownView);
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
			const content = await this.create_content_list(file);

			this.app.vault.append(file, content);
		}
	}
}
