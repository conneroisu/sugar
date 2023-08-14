/*
 * Filename: /Users/connerohnesorge/Documents/000Vaults/Sugar Development Vault/.obsidian/plugins/sugar/src/obj/sugar_position_memory.ts
 * Path: /Users/connerohnesorge/Documents/000Vaults/Sugar Development Vault/.obsidian/plugins/sugar
 * Created Date: Saturday, July 22nd 2023, 11:41:56 pm
 * Author: Conner Ohnesorge
 * MIT License
 * Copyright (c) 2023 Conner Ohnesorge
 */

import {
	App,
	MarkdownView,
	TAbstractFile,
	Editor,
	EphemeralState,
} from "obsidian";
import SugarPlugin from "../main";
import {CURSOR_DB_NAME, CURSOR_SAVE_INTERVAL} from "./constants";
import {sep} from "path";
import {CURSOR_OPEN_DELAY} from "./constants";

interface EmpherialState {
	cursor?: {
		from: {
			character: number;
			line: number;
		};
		to: {
			character: number;
			line: number;
		};
	};
	scroll?: number;
}
export default class SugarPostionMemory {
	plugin: SugarPlugin;
	debug: boolean;
	app: App;
	db: {[file_path: string]: EmpherialState};
	lastSavedCursorPositionDB: {[file_path: string]: EmpherialState};
	lastEphemerialState: EmpherialState;
	latestLoadedFile: string;
	loadingFile: boolean;

	constructor(sugar_plugin: SugarPlugin) {
		this.plugin = sugar_plugin;
		this.app = this.plugin.app;
		this.debug = this.plugin.settings.debug;
		this.init_sugar_position_memory();
	}

	async init_sugar_position_memory(): Promise<void> {
		try {
			this.db = (await this.readDb()) as {
				[file_path: string]: EmpherialState;
			};
			this.lastSavedCursorPositionDB = await this.readDb();
		} catch (e) {
			console.error(
				"Remember Cursor Position plugin can't read database: " + e
			);
			this.db = {};
			this.lastSavedCursorPositionDB = {};
		}
		this.plugin.registerInterval(
			window.setInterval(() => this.checkEphemeralStateChanged(), 10)
		);

		this.plugin.registerInterval(
			window.setInterval(
				() =>
					this.writeDb(
						this.db as {[file_path: string]: EphemeralState}
					),
				CURSOR_SAVE_INTERVAL
			)
		);

		this.restoreEphemeralState();
		this.plugin.registerEvent(
			this.app.workspace.on("file-open", (file) =>
				this.restoreEphemeralState()
			)
		);

		this.plugin.registerEvent(
			this.app.workspace.on("quit", () => {
				return this.writeDb(
					this.db as {[file_path: string]: EphemeralState}
				);
			})
		);

		this.plugin.registerEvent(
			this.app.vault.on("delete", (file) => this.deleteFile(file))
		);
	}

	deleteFile(file: TAbstractFile) {
		const fileName = file.path;
		delete this.db[fileName];
	}

	checkEphemeralStateChanged() {
		const fileName = this.app.workspace.getActiveFile()?.path;

		//waiting for load new file
		if (
			!fileName ||
			!this.latestLoadedFile ||
			fileName != this.latestLoadedFile ||
			this.loadingFile
		) {
			return;
		}

		const st = this.getEphemeralState();

		if (!this.lastEphemerialState) {
			this.lastEphemerialState = st;
		}

		if (
			!isNaN(st.scroll as number) &&
			!this.isEphemeralStatesEquals(
				st,
				this.lastEphemerialState as EphemeralState
			)
		) {
			this.saveEphemeralState(st);
			this.lastEphemerialState = st;
		}
	}

	isEphemeralStatesEquals(
		state1: EphemeralState,
		state2: EphemeralState
	): boolean {
		if (state1.cursor && !state2.cursor) {
			return false;
		}

		if (!state1.cursor && state2.cursor) {
			return false;
		}

		if (state1.cursor) {
			if (state1.cursor.from.ch != state2.cursor.from.ch) {
				return false;
			}
			if (state1.cursor.from.line != state2.cursor.from.line) {
				return false;
			}
			if (state1.cursor.to.ch != state2.cursor.to.ch) {
				return false;
			}
			if (state1.cursor.to.line != state2.cursor.to.line) {
				return false;
			}
		}

		if (state1.scroll && !state2.scroll) {
			return false;
		}

		if (!state1.scroll && state2.scroll) {
			return false;
		}

		if (state1.scroll && state1.scroll != state2.scroll) {
			return false;
		}

		return true;
	}

	async saveEphemeralState(st: EphemeralState) {
		const fileName = this.app.workspace.getActiveFile()?.path;
		if (fileName && fileName == this.latestLoadedFile) {
			//do not save if file changed or was not loaded
			this.db[fileName] = st;
		}
	}

	async restoreEphemeralState() {
		const file = this.app.workspace.getActiveFile();
		const fileName = file?.path;

		if (fileName && this.loadingFile && this.latestLoadedFile == fileName) {
			return;
		}

		this.loadingFile = true;

		if (this.latestLoadedFile != fileName) {
			this.lastEphemerialState = {};
			if (
				fileName &&
				file.path.includes(this.plugin.settings.sugar_directory)
			) {
				this.latestLoadedFile = fileName;
			}

			if (fileName) {
				const st = this.db[fileName];
				if (st) {
					//waiting for load note
					await this.delay(CURSOR_OPEN_DELAY);
					let scroll: number;
					for (let i = 0; i < 20; i++) {
						const scroll_res = this.app.workspace
							.getActiveViewOfType(MarkdownView)
							?.currentMode?.getScroll();
						if (scroll_res != null) {
							// eslint-disable-next-line @typescript-eslint/no-unused-vars
							scroll = scroll_res;
						} else {
							break;
						}
						await this.delay(10);
					}
				}
				this.lastEphemerialState = st;
			}
			this.loadingFile = false;
		}
	}

	async readDb(): Promise<{[file_path: string]: EphemeralState}> {
		let db: {[file_path: string]: EphemeralState} = {};

		if (await this.app.vault.adapter.exists(CURSOR_DB_NAME)) {
			const data = await this.app.vault.adapter.read(CURSOR_DB_NAME);
			db = JSON.parse(data);
		}

		return db;
	}

	async writeDb(db: {[file_path: string]: EphemeralState}) {
		//create folder for db file if not exist
		const newParentFolder = CURSOR_DB_NAME.substring(
			0,
			CURSOR_DB_NAME.lastIndexOf(sep)
		);
		if (!(await this.app.vault.adapter.exists(newParentFolder))) {
			this.app.vault.adapter.mkdir(newParentFolder);
		}

		if (
			JSON.stringify(this.db) !==
			JSON.stringify(this.lastSavedCursorPositionDB)
		) {
			this.app.vault.adapter.write(CURSOR_DB_NAME, JSON.stringify(db));
			this.lastSavedCursorPositionDB = JSON.parse(JSON.stringify(db));
		}
	}

	getEphemeralState(): EphemeralState {
		// let state: EphemeralState = this.app.workspace.getActiveViewOfType(MarkdownView)?.getEphemeralState(); //doesn't work properly

		const state: EphemeralState = {
			cursor: {
				from: {
					ch: 0,
					line: 0,
				},
				to: {
					ch: 0,
					line: 0,
				},
			},
		};

		state.scroll = Number(
			this.app.workspace
				.getActiveViewOfType(MarkdownView)
				?.currentMode?.getScroll()
				?.toFixed(4)
		);

		const editor = this.getEditor();
		if (editor) {
			const from = editor.getCursor("anchor");
			const to = editor.getCursor("head");
			if (from && to) {
				state.cursor = {
					from: {
						character: from.ch,
						line: from.line,
					},
					to: {
						character: to.ch,
						line: to.line,
					},
				};
			}
		}

		return state;
	}

	setEphemeralState(state: EphemeralState) {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);

		if (state.cursor) {
			const editor = this.getEditor();
			if (editor) {
				editor.setSelection(state.cursor.from, state.cursor.to);
			}
		}

		if (view && state.scroll) {
			view.setEphemeralState(state);
		}
	}

	private getEditor(): Editor | undefined {
		return this.plugin.app.workspace.getActiveViewOfType(MarkdownView)
			?.editor;
	}

	async delay(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
}
