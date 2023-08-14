/*
 * Filename: /Users/connerohnesorge/Documents/000Vaults/Sugar Development Vault/.obsidian/plugins/sugar/src/command_handler.ts
 * Path: /Users/connerohnesorge/Documents/000Vaults/Sugar Development Vault/.obsidian/plugins/sugar
 * Created Date: Tuesday, July 11th 2023, 6:05:47 pm
 * Author: Conner Ohnesorge
 * MIT License
 * Copyright (c) 2023 Conner Ohnesorge
 */

import SugarPlugin from "../main";

/**
 * A class to handle the commands of the SugarPlugin
 **/
export class CommandHandler {
	plugin: SugarPlugin;

	constructor(plugin: SugarPlugin) {
		this.plugin = plugin;
		if (this.plugin.settings.debug) {
			console.log("Loading the Command Handler class.");
		}
		this.setup();
	}

	/**
	 * Setup method of the Command handler class which adds commands to the plugin instance while loaded
	 **/
	setup(): void {
		if (this.plugin.settings.debug) {
			console.log("Setup Method of Command Handler is running.");
		}

		this.plugin.addCommand({
			id: "open-sugar-view",
			name: "Sugar View Open",
			callback: () => {
				this.plugin.sugar.openSugar();
			},
		});
		this.plugin.addCommand({
			id: "save-sugar-view",
			name: "Save Sugar View",
			checkCallback: (checking: boolean) => {
				const currentFile = this.plugin.app.workspace.getActiveFile();
				if (
					currentFile?.path.contains(
						this.plugin.settings.sugar_directory
					)
				) {
					if (!checking) {
						this.plugin.sugar.save_sugar();
					}
					return true;
				}
			},
		});

		this.plugin.addCommand({
			id: "update-sugar-view",
			name: "Update/Reload Sugar View",
			checkCallback: (checking: boolean) => {
				const currentFile = this.plugin.app.workspace.getActiveFile();
				if (
					currentFile?.path.contains(
						this.plugin.settings.sugar_directory
					)
				) {
					if (!checking) {
						this.plugin.sugar.reload_sugar();
					}
					return true;
				}
			},
		});

		this.plugin.addCommand({
			id: "select-sugar-entry",
			name: "Select Sugar Entry",
			checkCallback: (checking: boolean) => {
				const currentFile = this.plugin.app.workspace.getActiveFile();
				if (
					currentFile?.path.contains(
						this.plugin.settings.sugar_directory
					)
				) {
					if (!checking) {
						this.plugin.sugar.select_entry();
					}
					return true;
				}
			},
		});

		// TODO: Add this command to allow for the insertion of a character into the sugar view
		// this.plugin.addCommand({
		// 	id: "insert-sugar-template-character",
		// 	name: "Sugar Insert Character Inserted",
		// 	callback: () => {
		// 		// this.plugin.sugar.insert_sugar_template_character()
		// 	},
		// });
		if (this.plugin.settings.debug) {
			console.log("Setup Method of the Command Handler has ran.");
		}
	}
}
