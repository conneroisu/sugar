import { TAbstractFile, Vault } from "obsidian";
import { resolve_tfolder } from "./util";

export const possibleActions = ["add", "delete", "rename", "move"];

export class Action {
	vault: Vault;
	type: string;
	target_path: string;
	original_path: string;

	Action(
		vault: Vault,
		type: string,
		target_path: string,
		original_path: string
	) {
		this.vault = vault;
		this.type = type;
		this.target_path = target_path;
		this.original_path = original_path;
	}

	getType(): string {
		return this.type;
	}

	execute() {
		const res = resolve_tfolder(this.target_path);
		switch (this.type) {
			case "create": {
				this.vault.create(this.target_path, "");
				break;
			}
			case "delete": {
				if (res instanceof TAbstractFile && res !== null) {
					this.vault.delete(res, true);
				}
				break;
			}
			case "move": {
				if (res instanceof TAbstractFile && res !== null) {
					this.vault.rename(res, this.target_path);
				}
				break;
			}
			default:
				throw new Error("Invalid action type");
		}
	}


}
