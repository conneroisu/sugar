import {Editor, MarkdownView, Plugin, WorkspaceLeaf} from 'obsidian';

import {DEFAULT_SETTINGS, SugarSettings} from './settings/obj/SugarSettings';
import {SugarSettingTab} from './settings/obj/SugarSettingTab';

import {Ninja} from './settings/obj/Ninja';
import Sugar from './obj/sugar';
import {SUGAR_VIEW_TYPE, SugarView, FILE_EXTENSIONS} from './obj/view'

export default class SugarPlugin extends Plugin {
	settings: SugarSettings;
	sugar: Sugar;

	async onload() {
		await this.loadSettings();

		this.sugar = new Sugar(this)

		this.registerView(SUGAR_VIEW_TYPE, (leaf: WorkspaceLeaf) => new SugarView(leaf, this.sugar));
		this.registerExtensions([FILE_EXTENSIONS], SUGAR_VIEW_TYPE);

		// This creates an icon in the left ribbon.
		this.addRibbonIcon('mountain', 'Sugar Rock', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			if (this.settings.debug) {console.log("Opened Oil View")}
			this.sugar.open_oil();
		});

		this.addCommand({
			id: "toggle-oil-view",
			name: "Oil View Open",
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.sugar.open_oil();
				if (this.settings.debug) {console.log("Opened Oil View")}
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SugarSettingTab(this.app, this));

		// registers an interval to continue to hide the sugar path of the plugin
		this.registerInterval(window.setInterval(() => Ninja.hidePath(this.settings.sugar_directory), 10));
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



