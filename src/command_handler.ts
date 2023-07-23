import SugarPlugin from "./main";

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
				this.plugin.sugar.open_sugar();
			},
		});
		this.plugin.addCommand({
			id: "save-sugar-view",
			name: "Sugar View Saved",
			callback: () => {
				this.plugin.sugar.save_sugar();
			},
		});

		this.plugin.addCommand({
			id: "select-sugar-entry",
			name: "Select Sugar Entry",
			callback: () => {
				this.plugin.sugar.select_entry();
			},
		});
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
