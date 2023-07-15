import {ViewPlugin, Plugin, WorkspaceLeaf, MarkdownView} from "obsidian";

import {DEFAULT_SETTINGS, SugarSettings} from "./settings/obj/SugarSettings";
import {SugarSettingTab} from "./settings/obj/SugarSettingTab";

import {Ninja} from "./settings/obj/Ninja";
import {SUGAR_VIEW_TYPE, SugarView, FILE_EXTENSIONS} from "./obj/view";

import {CommandHandler} from "./command_handler";
import Sugar from "./obj/sugar";

export default class SugarPlugin extends Plugin {
	public settings: SugarSettings;
	public sugar: Sugar;
	public command_handler: CommandHandler;

	async onload() {
		await this.loadSettings();

		if (this.settings.debug) {
			console.log("Loading 🍩 Sugar plugin");
		}

		this.sugar = new Sugar(this);

		this.registerView(
			SUGAR_VIEW_TYPE,
			(leaf: WorkspaceLeaf) => new SugarView(leaf, this.sugar)
		);

		this.registerExtensions(FILE_EXTENSIONS, SUGAR_VIEW_TYPE);

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

	set_actice_sugar_path() {
		const current = this.app.workspace.getActiveFile();
		if (current && current.path.endsWith(".sugar")) {
			this.sugar.active_sugar_path = current.path;
			return;
		}
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
