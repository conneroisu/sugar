import SugarPlugin from "src/main";
import {App, TFile, normalizePath} from "obsidian";
import {SugarView, SUGAR_VIEW_TYPE} from "./view";
import * as fs from 'fs';
import * as path from 'path';
import {getASugarView} from "./util";

/** 
 * The main workhorse class for the sugar plugin 
 **/
export default class Sugar {
	plugin: SugarPlugin;
	app: App;

	/**
	 * Constructs a Sugar Rock object 
	 **/
	constructor(sugar_plugin: SugarPlugin) {
		this.plugin = sugar_plugin;
		this.app = this.plugin.app;
		if (this.plugin.settings.debug) {
			console.log("Loaded the Sugar Class");
		}
	}


	/**
	 * Command to open the sugar view of Type SugarView
	 **/
	async open_sugar(file_path: string) {
		const open_dir = this.plugin.settings.sugar_directory + path.sep + file_path + ".sugar"
		const df = await this.app.vault.create(open_dir, create_sugar_data(file_path));
		const sugarView = getASugarView(file_path)

		if (df && sugarView) {
			sugarView.file = df;
		}
		const leaves = this.plugin.app.workspace.getLeavesOfType(SUGAR_VIEW_TYPE);
		if (leaves.length > 0) {
			await leaves[0].openFile(df, {active: true});
		}

		const af = this.resolve_tfile(open_dir)
		if (af instanceof TFile && af != undefined) {
			const sugarView = getASugarView(this.plugin.active_sugar_path);
			if (sugarView) {
				sugarView.file = af;
			}
		}
		getASugarView(file_path);
		return;
	}


	/** 
	 * Processes the data contained in the sugar view 
	 **/
	processViewContent() {
		const sugarView = getASugarView(this.plugin.active_sugar_path);
		if (sugarView) {
			this.app.workspace.getLeavesOfType(SUGAR_VIEW_TYPE).forEach((leaf) => {
				if (leaf.view instanceof SugarView) {
					leaf.openFile(sugarView.file, {active: true});
				}
			});
		}
	}

	/** 
	 * Gives a TFile for a given vault path 
	 **/
	public resolve_tfile(file_str: string): TFile {
		if (this.plugin.settings.debug) {console.log("Normalizing file path: " + file_str)}
		file_str = normalizePath(file_str);

		const file = app.vault.getAbstractFileByPath(file_str);
		if (!file) {
			throw new Error(`File "${file_str}" doesn't exist`);
		}
		if (!(file instanceof TFile)) {
			throw new Error(`${file_str} is a folder, not a file`);
		}

		return file;
	}
}


/** 
 * Creates the data for a sugar file 
 **/
export function create_sugar_data(sugar_dir: string): string {
	if (!fs.existsSync(sugar_dir)) {
		return "";
	}

	const files = fs.readdirSync(sugar_dir);

	const contents: string[] = [];

	files.forEach((file) => {
		const filePath = path.join(sugar_dir, file);
		contents.push(fs.readFileSync(filePath, 'utf-8'));
	});

	console.log("data: " + contents.join('\n'))
	return contents.join('\n');
}

