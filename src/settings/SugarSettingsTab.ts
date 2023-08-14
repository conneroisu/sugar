/*
 * Filename: /Users/connerohnesorge/Documents/000Vaults/Sugar Development Vault/.obsidian/plugins/sugar/src/settings/SugarSettingTab.ts
 * Path: /Users/connerohnesorge/Documents/000Vaults/Sugar Development Vault/.obsidian/plugins/sugar
 * Created Date: Saturday, July 22nd 2023, 11:10:54 am
 * Author: Conner Ohnesorge
 * MIT License
 * Copyright (c) 2023 Conner Ohnesorge
 */

import {
	ToggleComponent,
	ButtonComponent,
	App,
	PluginSettingTab,
	Setting,
} from "obsidian";
import {FolderSuggest} from "./folder_suggestion";
import SugarPlugin from "../main";
import {Ninja} from "./Ninja";
import path from "path";

/**
 * This is a settings tab for the plugin, Sugar.
 **/
export class SugarSettingTab extends PluginSettingTab {
	plugin: SugarPlugin;

	constructor(app: App, plugin: SugarPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl("h2", {text: "Settings for the Sugar Plugin"});

		// get the vault name by getting the last element of the absolute path of the vault
		const basePath = (this.app.vault.adapter as any).basePath;
		const vaultName = basePath.split(path.sep).pop();

		/**
		 * This is a settitng for the directory where .sugar files are stored and hidden for items inside of a directory
		 **/
		new Setting(containerEl)
			.setName("Sugar Directory")

			.setDesc(
				"Directory name to hide the sugar files inside of. Additionally, the folder will be hidden from the file explorer inside Obsidian depending on the following setting. (Default: 'sugar', meaning that the sugar view files will be generated in " +
				vaultName +
				path.sep +
				"sugar" +
				")"
			)
			.addSearch((cb) => {
				new FolderSuggest(cb.inputEl);
				cb.setPlaceholder("example: folder1/folder2")
					.setValue(this.plugin.settings.sugar_directory)
					.onChange((new_folder) => {
						Ninja.unhidePath(this.plugin.settings.sugar_directory);
						this.plugin.ninja.unhidePath(new_folder);
						this.plugin.settings.sugar_directory = new_folder;
						this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName("Hide Sugar Directory")
			.setDesc(
				"Status of whether the sugar directory is hidden from the file explorer inside of Obsidian. (Default: true, meaning that the sugar directory is hidden from the file explorer)"
			)
			.addToggle((toggle: ToggleComponent) =>
				toggle.onChange(async (value: boolean) => {
					this.plugin.settings.hide_sugar_directory = value;
					await this.plugin.saveSettings();
				})
			);

		/**
		 * This is the toggle for the debug mode for the plugin allowing for more diagnotstic information to be logged
		 **/
		new Setting(containerEl)
			.setName("Debug")
			.setDesc(
				"Status of Sugar's Debugging mode allowing for more diagnostic info to be logged for developer users. (Default: false, meaning that debug mode is off)"
			)
			.addToggle((toggle: ToggleComponent) =>
				toggle
					.setValue(this.plugin.settings.debug)
					.onChange(async (value: boolean): Promise<void> => {
						value;
						this.plugin.settings.debug = value;
						await this.plugin.saveSettings();
					})
			);
		/**
		 * This is a setting that is a toggle for treating files without extensions as markdown files inside of the Sugar View.
		 **/
		new Setting(containerEl)
			.setName("No Extension Markdown Default")
			.setDesc(
				"Status determining whether files created without extensions within the sugar view are treated as markdown files. (Default: true, meaning that files without extensions are treated as markdown files)"
			)
			.addToggle((toggle: ToggleComponent) =>
				toggle
					.setValue(
						this.plugin.settings.no_extension_markdown_default
					)
					.onChange(async (value: boolean) => {
						value;
						this.plugin.settings.no_extension_markdown_default =
							value;
						await this.plugin.saveSettings();
					})
			);
		/**
		 * Button that to report an issue to the Obsidian sugar repository.
		 **/
		new Setting(containerEl)
			.setName("Report Issue")
			.setDesc("Report an issue or wanted feature with the Sugar plugin.")
			.addButton((button: ButtonComponent) =>
				button
					.setButtonText("Report Issue/Feature")
					.setCta()
					.onClick(() => {
						open("https://github.com/conneroisu/sugar/issues/new");
					})
			);

		/**
		 * Button that to create a pull request to the Obsidian sugar repository
		 **/
		new Setting(containerEl)
			.setName("Create Pull Request")
			.setDesc("Developer? Create a pull request to Sugar.")
			.addButton((button: ButtonComponent) => {
				button
					.setButtonText("Create Pull Request")
					.setCta()
					.onClick(() => {
						open("https://github.com/conneroisu/sugar/compare");
					});
			});
	}
}
