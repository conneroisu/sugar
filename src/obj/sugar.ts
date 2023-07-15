import SugarPlugin from "src/main";
import {App, TFile} from "obsidian";
import * as path from "path";
import {getASugarView, resolve_tfile} from "./util";
import {create_content_list} from "./util";
import {SugarView, SUGAR_VIEW_TYPE} from "./view";

/**
 * The main workhorse class for the sugar plugin
 **/
export default class Sugar {
	plugin: SugarPlugin;
	app: App;
	active_sugar_path: string;

	constructor(sugar_plugin: SugarPlugin) {
		this.plugin = sugar_plugin;
		this.app = this.plugin.app;
		if (this.plugin.settings.debug) {
			console.log("Loaded the Sugar Class");
		}
	}

	async open_sugar(file_path: string) {
		// sugar directory = file path - all / and \ + .sugar
		this.active_sugar_path =
			"sug" +
			path.sep +
			file_path.replace(/\\/g, "/").replace(/\//g, "-") +
			".sug";
		console.log("opening sugar: " + this.active_sugar_path);
		const open_dir =
			this.plugin.settings.sugar_directory +
			path.sep +
			file_path +
			".sug";
		console.log("Sugar Directory" + this.plugin.settings.sugar_directory);
		// create df a TFile for the sugar file
		let df: TFile;
		// remove the file name from the file_path and set to / if is at the base of the vault
		try {
			df = await this.app.vault.create(
				open_dir,
				create_content_list(file_path, this.plugin)
			);
			// log the contents of the file
			console.log(
				"Created file contents: " + this.plugin.app.vault.cachedRead(df)
			);
		} catch (e) {
			df = resolve_tfile(open_dir);
			console.log(
				"Found file contents: " +
				(await this.plugin.app.vault.cachedRead(df))
			);
		}
		// console.log("df: " + df);
		const sugarView = getASugarView(df.path);
		// Create a new leaf
		const leaf = this.app.workspace.getLeaf();
		// console.log("leaf: " + leaf);
		leaf.open(sugarView);
		leaf.openFile(df);
		sugarView.file = df;

		return;
	}
}
