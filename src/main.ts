/*
 * Filename: /Users/connerohnesorge/Documents/000Vaults/Sugar Development Vault/.obsidian/plugins/sugar/src/main.ts
 * Path: /Users/connerohnesorge/Documents/000Vaults/Sugar Development Vault/.obsidian/plugins/sugar
 * Created Date: Saturday, July 22nd 2023, 11:10:54 am
 * Author: Conner Ohnesorge
 * MIT License
 * Copyright (c) 2023 Conner Ohnesorge
 */

import {Plugin} from "obsidian";
import {DEFAULT_SETTINGS, SugarSettings} from "./settings/SugarSettings";
import {SugarSettingTab} from "./settings/SugarSettingsTab";
import {Ninja} from "./settings/Ninja";

import {CommandHandler} from "./command_handler";
import Sugar from "./obj/sugar";
import SugarPostionMemory from "./obj/sugar_position_memory";
import {SugarOperationView} from "./obj/ui/view";
import store from "./obj/ui/store";

export default class SugarPlugin extends Plugin {
	public settings: SugarSettings;
	public sugar: Sugar;
	public sugar_position_memory: SugarPostionMemory;
	public command_handler: CommandHandler;
	ninja: Ninja;

	async onload() {
		await this.loadSettings();
		// add ignore to the vault .config json file

		if (this.settings.debug) {
			console.log("Loading 🍩 Sugar plugin");
		}

		this.sugar = new Sugar(this);
		this.ninja = new Ninja(this);
		this.sugar_position_memory = new SugarPostionMemory(this);

		this.registerExtensions(["sugar"], "markdown");

		this.command_handler = new CommandHandler(this);

		this.addSettingTab(new SugarSettingTab(this.app, this));

		// registers an interval to continue to hide the sugar path of the plugin
		this.registerInterval(
			window.setInterval(
				() => this.ninja.hidePath(this.settings.sugar_directory),
				1000
			)
		);
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
