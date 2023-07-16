import SugarPlugin from "src/main";
import {App, normalizePath, TFile} from "obsidian";
import {create_content_list, resolve_tfile} from "./util";
import {sep} from "path";
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

	async open_sugar(): Promise<void> {
		// get the active workspace leaf
		const leaf = this.app.workspace.activeLeaf;
		const file_path = leaf?.view.file.path;

		if (file_path) {
			const latent_sugar_file = await this.getLatentSugarFile(file_path);
			leaf?.openFile(latent_sugar_file, {active: true});
		}
	}

	/**
	 * Gets the latent sugar file for a given file path
	 **/
	async getLatentSugarFile(file_path: string): Promise<TFile> {
		file_path = normalizePath(file_path);
		const path: string = file_path.replace(sep, "^");
		let latent_sugar_file: TFile;

		const latent_sugar_file_path =
			this.plugin.settings.sugar_directory + sep + "♺" + path;
		try {
			latent_sugar_file = await this.app.vault.create(
				latent_sugar_file_path,
				create_content_list(file_path)
			);
		} catch (ALREADY_EXISTS) {
			latent_sugar_file = resolve_tfile(latent_sugar_file_path);
		}
		return latent_sugar_file;
	}
}
