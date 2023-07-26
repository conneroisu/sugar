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
import { FolderSuggest } from "./folder_suggestion";
import SugarPlugin from "src/main";
import { Ninja } from "./Ninja";

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
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h2", { text: "Settings for the Sugar Plugin" });

		/**
		 * This is a settitng for the directory where .sugar files are stored and hidden for items inside of a directory
		 **/
		new Setting(containerEl)
			.setName("Sugar Directory")
			.setDesc(
				"Directory name to hide the sugar files inside of. Additionally, the folder will be hidden from the file explorer inside Obsidian."
			)
			.addSearch((cb) => {
				new FolderSuggest(cb.inputEl);
				cb.setPlaceholder("example: folder1/folder2")
					.setValue(this.plugin.settings.sugar_directory)
					.onChange((new_folder) => {
						Ninja.unhidePath(this.plugin.settings.sugar_directory);
						Ninja.unhidePath(new_folder);
						this.plugin.settings.sugar_directory = new_folder;
						this.plugin.saveSettings();
					});
			});
		/**
		 * This is the toggle for the debug mode for the plugin allowing for more diagnotstic information to be logged
		 **/
		new Setting(containerEl)
			.setName("Debug`")
			.setDesc(
				"Status fo teh Debugging mode allowing for more diagnostic info to be logged."
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
		 * This is a setting that is a toggle for showing hidden files.
		 **/
		new Setting(containerEl)
			.setName("Show Hidden Files")
			.setDesc(
				"Status determining whether hidden files are shown in the Sugar view."
			)
			.addToggle((toggle: ToggleComponent) =>
				toggle
					.setValue(this.plugin.settings.show_hidden)
					.onChange(async (value: boolean): Promise<void> => {
						value;
						this.plugin.settings.show_hidden = value;
						await this.plugin.saveSettings();
					})
			);

		/**
		 * This is a setting that is a toggle for treating files without extensions as markdown files inside of the Sugar View.
		 **/
		new Setting(containerEl)
			.setName("No Extension Markdown Default")
			.setDesc(
				"Status determining whether files without extensions within the oil view are treated as markdown files. (Default: true, meaning that files without extensions are treated as markdown files)"
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
		 * Toggle representing the state of the debug setting for the plugin
		 **/
		new Setting(containerEl)
			.setName("Status of the Debug Setting")
			.setDesc("Allows for logging of states into the console ")
			.addToggle((toggle: ToggleComponent) =>
				toggle
					.setValue(this.plugin.settings.debug)
					.onChange(async (value: boolean) => {
						value;
						this.plugin.settings.debug = value;
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
