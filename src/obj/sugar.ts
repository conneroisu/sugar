import SugarPlugin from "src/main";
import { App, TFile } from "obsidian";
import { SugarView, SUGAR_VIEW_TYPE } from "./view";
import * as path from "path";
import { getASugarView, resolve_tfile } from "./util";
import { create_content_list } from "./util";

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
			"sugar" +
			path.sep +
			file_path.replace(/\\/g, "/").replace(/\//g, "-") +
			".sugar";
		const open_dir =
			this.plugin.settings.sugar_directory +
			path.sep +
			file_path +
			".sugar";
		// create df a TFile for the sugar file
		let df: TFile;
		// remove the file name from the file_path and set to / if is at the base of the vault
		try {
			df = await this.app.vault.create(
				open_dir,
				create_content_list(file_path, this.plugin)
			);
		} catch (e) {
			df = resolve_tfile(file_path);
		}
		const sugarView = getASugarView(file_path);

		if (df && sugarView) {
			sugarView.file = df;
		}
		const leaves =
			this.plugin.app.workspace.getLeavesOfType(SUGAR_VIEW_TYPE);
		if (leaves.length > 0) {
			await leaves[0].openFile(df, { active: true });
		}

		const af = resolve_tfile(open_dir);
		if (af instanceof TFile && af != undefined) {
			const sugarView = getASugarView(this.active_sugar_path);
			if (sugarView) {
				sugarView.file = af;
			}
		}
		getASugarView(file_path);
		return;
	}

	processViewContent() {
		const sugarView = getASugarView(this.active_sugar_path);
		if (sugarView) {
			this.app.workspace
				.getLeavesOfType(SUGAR_VIEW_TYPE)
				.forEach((leaf) => {
					if (leaf.view instanceof SugarView) {
						leaf.openFile(sugarView.file, { active: true });
					}
				});
		}
	}
}
