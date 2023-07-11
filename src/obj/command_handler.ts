import SugarPlugin from "src/main";

export class CommandHandler {
	plugin: SugarPlugin;

	constructor(plugin: SugarPlugin) {
		this.plugin = plugin;

		if (this.plugin.settings.debug) {
			console.log("Loading the Command Handler class.")
		}
		this.setup();
	}

	/** 
	* Setup method of the Command handler class which adds commands to the plugin instance while loaded 
	**/
	setup(): void {

		if (this.plugin.settings.debug) {
			console.log("Setup Method of Command Handler is running.")
		}
		this.plugin.addCommand({
			id: "toggle-sugar-view",
			name: "Sugar View Open",
			callback: () => {
				const file = this.plugin.app.workspace.getActiveFile()
				if (file === undefined || !file) {
					console.log("Error: Could not get active file path")
				} else {
					this.plugin.sugar.open_sugar(file.path);
				}

				if (this.plugin.settings.debug) { console.log("Opened Oil View") }
			},
		});
		if (this.plugin.settings.debug) {
			console.log("Setup Method of the Command Handler has ran.")
		}
	}
}
