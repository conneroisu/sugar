import SugarPlugin from "src/main";
import {App} from "obsidian";
import {SugarView, SUGAR_VIEW_TYPE, FILE_EXTENSIONS} from "./view";


export default class Sugar {
	plugin: SugarPlugin;
	app: App;

	/**  
	* Consdtructs a s Sugar Rock object 
	**/
	constructor(sugar_plugin: SugarPlugin) {
		this.plugin = sugar_plugin;
		this.app = this.plugin.app
	}

	/**
	 * Command to open the sugar view of Type SugarView
	 **/
	async open_oil() {
		// if a sugar view is open in the current workspace, open the previous directory
		// if (this.isOpen) {
		// 	this.go_to_parent();
		// }


		if (this.app.workspace.getLeavesOfType(SUGAR_VIEW_TYPE).length > 0) {
			this.app.workspace.detachLeavesOfType(SUGAR_VIEW_TYPE);
		}
		// create a new leaf if there are no other leaves open
		else if (this.app.workspace.getLeavesOfType(SUGAR_VIEW_TYPE).length === 0) {
			await this.app.workspace.getLeaf(true).setViewState({
				type: SUGAR_VIEW_TYPE,
				active: true,
			});
		}
		return;
	}




	processViewContent() {
		this.app.workspace.getLeavesOfType(SUGAR_VIEW_TYPE).forEach((leaf) => {
			if (leaf.view instanceof SugarView) {
				leaf.openFile
			}
		});
	}


}


