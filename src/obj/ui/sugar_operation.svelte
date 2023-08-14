<script lang="ts">
	import { Console } from "console";
	import { AbstractTextComponent, Modal } from "obsidian";
	import store from "./store";
	import Sugar from "../sugar";
	import SugarPlugin from "../../main";

	let columns = ["Type", "Details"];
	let data = [
		["CREATE", "john@example.com"],
		["DELETE", "file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["RENAME", "file_name.md → new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
	];
	let newRow = [...columns];

	this.currentClass = "CRATE";

	function getClass(cell: string): string {
		if (cell.toUpperCase() === "CREATE") {
			return "create";
		} else if (cell.toUpperCase() === "DELETE") {
			return "delete";
		} else if (cell.toUpperCase() === "MOVE") {
			return "move";
		} else if (cell.toUpperCase() === "RENAME") {
			return "rename";
		} else {
			return "";
		}
	}
</script>

<table>
	<tr>
		{#each columns as column}
			<th>{column}</th>
		{/each}
	</tr>

	{#each data as row}
		<tr>
			{#each row as cell}
				<td
					contenteditable="false"
					bind:innerHTML={cell}
					class={getClass(cell)}
				/>
			{/each}
		</tr>
	{/each}
</table>

<style>
	.mod-cta {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.create {
		color: #00ff00;
	}
	.delete {
		color: #ff0000;
	}
	.move {
		color: #0000ff;
	}
	.rename {
		color: orange;
	}
</style>
