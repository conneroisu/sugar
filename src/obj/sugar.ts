import SugarPlugin from "src/main";
import { App, TFile, normalizePath } from "obsidian";
import { SugarView, SUGAR_VIEW_TYPE } from "./view";
import * as fs from 'fs';
import * as path from 'path';

export default class Sugar {
	/**
	 * a sugar has a reference to the sugar plugin class
	 **/
	plugin: SugarPlugin;
	/** 
	 * a sugar has a reference to the obsidian app during runtime
	 **/
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
	async open_oil(file_path: string) {
		const open_dir = this.plugin.settings.sugar_directory + path.sep + file_path + ".sugar"
		try {
			const sugarView = getSugarView(file_path)

			const df = await this.app.vault.create(open_dir, create_sugar_data(open_dir));

			console.log("Just tried to create sugar data")
			if (df && sugarView) {
				this.app.vault.append(df, create_sugar_data(file_path))
				sugarView.file = df;
			}

			const leaves = this.plugin.app.workspace.getLeavesOfType(SUGAR_VIEW_TYPE);
			if (leaves.length > 0) {
				await leaves[0].openFile(df, { active: true });
			}
		} catch (e) {
			const af = this.resolve_tfile(open_dir)
			if (af instanceof TFile && af != undefined) {
				const sugarView = getSugarView(this.plugin.active_sugar_path);
				if (sugarView) {
					sugarView.file = af;
				}
			} else {
				console.log(e);
				console.log("Error: Could not open file");
			}
		}

		getSugarView(file_path);
		return;
	}


	processViewContent() {
		const sugarView = getSugarView(this.plugin.active_sugar_path);
		if (sugarView) {
			this.app.workspace.getLeavesOfType(SUGAR_VIEW_TYPE).forEach((leaf) => {
				if (leaf.view instanceof SugarView) {
					leaf.openFile(sugarView.file, { active: true });
				}
			});
		}
	}
	resolve_tfile(file_str: string): TFile {
		if (file_str === undefined) {
			file_str = this.plugin.active_sugar_path;
		}
		console.log("Normalizing file path: " + file_str)
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


export function create_sugar_data(sugar_dir: string): string {
	if (!fs.existsSync(sugar_dir)) {
		return "";
	}

	const files = fs.readdirSync(sugar_dir);

	const contents: string[] = []; // initialize contents as an empty array

	files.forEach((file) => {
		const filePath = path.join(sugar_dir, file);
		contents.push(fs.readFileSync(filePath, 'utf-8')); // push each file content into the array
	});

	console.log("data: " + contents.join('\n'))
	return contents.join('\n');
}

/** 
 * Retrieves the active sugar view 
 **/
export function getSugarView(path: string): SugarView {

	if (this.app.workspace.getLeavesOfType(SUGAR_VIEW_TYPE).length === 0) {
		return new SugarView(this.app.workspace.getLeaf(true), this, path)
	}
	return this.app.workspace.getLeavesOfType(SUGAR_VIEW_TYPE)[0].view as SugarView;
}

