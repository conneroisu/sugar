import {Plugin} from "obsidian";

import {DEFAULT_SETTINGS, SugarSettings} from "./settings/SugarSettings";
import {SugarSettingTab} from "./settings/SugarSettingTab";
import {Ninja} from "./settings/Ninja";

import {CommandHandler} from "./command_handler";
import Sugar from "./obj/sugar";
import {sep} from "path";
import SugarPostionMemory from "./obj/sugar_position_memory";

export default class SugarPlugin extends Plugin {
	public settings: SugarSettings;
	public sugar: Sugar;
	public sugar_position_memory: SugarPostionMemory;
	public command_handler: CommandHandler;

	async onload() {
		await this.loadSettings();

		// add ignore to the vault .config json file

		if (this.settings.debug) {
			console.log("Loading 🍩 Sugar plugin");
		}

		this.sugar = new Sugar(this);
		this.sugar_position_memory = new SugarPostionMemory(this);

		this.registerExtensions(["sugar"], "markdown");

		this.command_handler = new CommandHandler(this);

		this.addSettingTab(new SugarSettingTab(this.app, this));

		// registers an interval to continue to hide the sugar path of the plugin
		this.registerInterval(
			window.setInterval(
				() => Ninja.hidePath(this.settings.sugar_directory),
				10
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
