import SugarPlugin from "./main";
import { resolve_tfile } from "./obj/util";

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
			id: "toggle-sugar-view",
			name: "Sugar View Open",
			callback: () => {
				const file = this.plugin.app.workspace.getActiveFile();
				if (file === undefined || !file) {
					console.log("Error: Could not get active file path");
				} else {
					this.plugin.sugar.open_sugar(file.path);
				}

				if (this.plugin.settings.debug) {
					console.log("Opened Sugar View");
				}
			},
		});
		this.plugin.addCommand({
			id: "test-tfile-finder",
			name: "TFile Find Test",
			callback: async () => {
				const file = this.plugin.app.workspace.getActiveFile();
				if (file) {
					const f = resolve_tfile(file.path);
					console.log("Found it mf:" + f.name);
					// now read from the file
					const readed = await this.plugin.app.vault.cachedRead(f);
					console.log(readed);
				}
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
