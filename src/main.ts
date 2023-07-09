import { Plugin, WorkspaceLeaf } from 'obsidian';

import { DEFAULT_SETTINGS, SugarSettings } from './settings/obj/SugarSettings';
import { SugarSettingTab } from './settings/obj/SugarSettingTab';

import { Ninja } from './settings/obj/Ninja';
import Sugar, { getSugarView } from './obj/sugar';
import { SUGAR_VIEW_TYPE, SugarView, FILE_EXTENSIONS } from './obj/view'
import { CommandHandler } from './obj/command_handler';

export default class SugarPlugin extends Plugin {
	public settings: SugarSettings;
	public sugar: Sugar;
	public command_handler: CommandHandler;
	public active_sugar_path: string;

	async onload() {
		await this.loadSettings();


		if (this.settings.debug) { console.log("loading sugar plugin") }

		this.sugar = new Sugar(this);

		this.registerView(SUGAR_VIEW_TYPE, (leaf: WorkspaceLeaf) => new SugarView(leaf, this.sugar, this.active_sugar_path));


		try {
			this.registerExtensions(FILE_EXTENSIONS, SUGAR_VIEW_TYPE);
		} catch (error) {
			console.log(`Existing file extension ${SUGAR_VIEW_TYPE}`);
		}

		this.command_handler = new CommandHandler(this);

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SugarSettingTab(this.app, this));

		// registers an interval to continue to hide the sugar path of the plugin
		this.registerInterval(window.setInterval(() => Ninja.hidePath(this.settings.sugar_directory), 10));

	}
	set_actice_sugar_path() {
		if (getSugarView(this.active_sugar_path) && getSugarView(this.active_sugar_path).file) {
			this.active_sugar_path = getSugarView(this.active_sugar_path).file.path;
			return;
		}
		const current = this.app.workspace.getActiveFile();
		if (current && current.path.endsWith(".sugar")) {
			this.active_sugar_path = current.path;
			return;
		}

	}


	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
