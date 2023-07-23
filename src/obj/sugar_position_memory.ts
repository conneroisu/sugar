import {
	App,
	MarkdownView,
	TAbstractFile,
	Editor,
	EphemeralState,
} from "obsidian";
import SugarPlugin from "src/main";
import {
	CURSOR_DB_FLUSH_INTERVAL,
	CURSOR_DB_NAME,
	CURSOR_SAVE_INTERVAL,
} from "./constants";
import { sep } from "path";
import { CURSOR_OPEN_DELAY } from './constants';

interface EmpherialState {
	cursor?: {
		from: {
			ch: number;
			line: number;
		};
		to: {
			ch: number;
			line: number;
		};
	};
	scroll?: number;
}
export default class SugarPostionMemory {
	plugin: SugarPlugin;
	debug: boolean;
	app: App;
	db_name: typeof CURSOR_DB_NAME;
	saveInterval: typeof CURSOR_SAVE_INTERVAL;
	flushInterval: typeof CURSOR_DB_FLUSH_INTERVAL;
	db: { [file_path: string]: EmpherialState };
	lastSavedDB: { [file_path: string]: EmpherialState };
	lastEphemerialState: EmpherialState;
	lastLoadedFile: string;
	loadingFile: boolean;

	constructor(sugar_plugin: SugarPlugin) {
		this.plugin = sugar_plugin;
		this.app = this.plugin.app;
		this.debug = this.plugin.settings.debug;
		this.db_name = CURSOR_DB_NAME;
		this.saveInterval = CURSOR_SAVE_INTERVAL;
		this.flushInterval = CURSOR_DB_FLUSH_INTERVAL;
		this.init_sugar_position_memory();
	}

	async init_sugar_position_memory(): Promise<void> {
		try {
			this.db = await this.readDb() as { [file_path: string]: EmpherialState };
			this.lastSavedDB = await this.readDb();
		} catch (e) {
			console.error(
				"Remember Cursor Position plugin can't read database: " + e
			);
			this.db = {};
			this.lastSavedDB = {};
		}
		this.plugin.registerInterval(
			window.setInterval(() => this.checkEphemeralStateChanged(), 100)
		);

		this.plugin.registerInterval(
			window.setInterval(
				() => this.writeDb(this.db as { [file_path: string]: EphemeralState }),
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
				return this.writeDb(this.db as { [file_path: string]: EphemeralState });
			})
		);

		this.plugin.registerEvent(
			this.app.vault.on("rename", (file, oldPath) =>
				this.renameFile(file, oldPath)
			)
		);

		this.plugin.registerEvent(
			this.app.vault.on("delete", (file) => this.deleteFile(file))
		);
	}
	renameFile(file: TAbstractFile, oldPath: string) {
		const newName = file.path;
		const oldName = oldPath;
		this.db[newName] = this.db[oldName];
		delete this.db[oldName];
	}

	deleteFile(file: TAbstractFile) {
		const fileName = file.path;
		delete this.db[fileName];
	}

	checkEphemeralStateChanged() {
		const fileName = this.app.workspace.getActiveFile()?.path;

		//waiting for load new file
		if (!fileName ||
			!this.lastLoadedFile ||
			fileName != this.lastLoadedFile ||
			this.loadingFile) {
			return;
		}

		const st = this.getEphemeralState();

		if (!this.lastEphemerialState) {
			this.lastEphemerialState = st;
		}

		if (
			!isNaN(st.scroll as number) &&
			!this.isEphemeralStatesEquals(st, this.lastEphemerialState as EphemeralState)
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
		if (fileName && fileName == this.lastLoadedFile) {
			//do not save if file changed or was not loaded
			this.db[fileName] = st;
		}
	}

	async restoreEphemeralState() {
		const fileName = this.app.workspace.getActiveFile()?.path;

		if (fileName && this.loadingFile && this.lastLoadedFile == fileName) {
			return;
		}

		this.loadingFile = true;

		if (this.lastLoadedFile != fileName) {
			this.lastEphemerialState = {};
			if (fileName) {
				this.lastLoadedFile = fileName;
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

	async readDb(): Promise<{ [file_path: string]: EphemeralState }> {
		let db: { [file_path: string]: EphemeralState } = {};

		if (await this.app.vault.adapter.exists(CURSOR_DB_NAME)) {
			const data = await this.app.vault.adapter.read(
				CURSOR_DB_NAME
			);
			db = JSON.parse(data);
		}

		return db;
	}

	async writeDb(db: { [file_path: string]: EphemeralState }) {
		//create folder for db file if not exist
		const newParentFolder = CURSOR_DB_NAME.substring(
			0,
			CURSOR_DB_NAME.lastIndexOf(sep)
		);
		if (!(await this.app.vault.adapter.exists(newParentFolder))) {
			this.app.vault.adapter.mkdir(newParentFolder);
		}

		if (JSON.stringify(this.db) !== JSON.stringify(this.lastSavedDB)) {
			this.app.vault.adapter.write(
				CURSOR_DB_NAME,
				JSON.stringify(db)
			);
			this.lastSavedDB = JSON.parse(JSON.stringify(db));
		}
	}

	getEphemeralState(): EphemeralState {
		// let state: EphemeralState = this.app.workspace.getActiveViewOfType(MarkdownView)?.getEphemeralState(); //doesn't work properly

		const state: EphemeralState = {};
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
						ch: from.ch,
						line: from.line,
					},
					to: {
						ch: to.ch,
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
