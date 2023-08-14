/*
 * Filename: /Users/connerohnesorge/Documents/000Vaults/Sugar Development Vault/.obsidian/plugins/sugar/src/settings/Ninja.ts
 * Path: /Users/connerohnesorge/Documents/000Vaults/Sugar Development Vault/.obsidian/plugins/sugar
 * Created Date: Saturday, July 22nd 2023, 11:10:54 am
 * Author: Conner Ohnesorge
 * MIT License
 * Copyright (c) 2023 Conner Ohnesorge
 */

/**
 * Ninja is a class that provides a set of static methods to hide and unhide elements in the DOM.
 * This is used to hide the sugar path in the file explorer.
 **/
export class Ninja {
	constructor(SugarPlugin: plugin) {
		this.plugin = SugarPlugin;
	}

	public hidePath(path: string) {
		if (this.plugin.settings.hide_sugar_directory == true) {
			this.changePathVisibility(path, true);
		}
	}
	public unhidePath(path: string) {
		this.changePathVisibility(path, false);
	}
	public changePathVisibility(path: string, hide: boolean) {
		const n = document.querySelector(`[data-path="${path}"]`);
		if (!n) {
			return;
		}
		const p = n.parentElement;
		if (p) {
			if (hide) {
				p.style.display = `none`;
			} else {
				p.style.display = ``;
			}
		}
	}
}
