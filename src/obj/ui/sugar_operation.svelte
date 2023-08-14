<script lang="ts">
	import { Console } from "console";

	let columns = ["Operation", "Details"];
	let data = [
		["CREATE", "john@example.com"],
		["DELETE", "file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
		["RENAME", "file_name.md → new_file_name.md"],
		["MOVE", "old_dir/file_name.md → new_dir/new_file_name.md"],
	];
	let newRow = [...columns];
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
				<td contenteditable="true" bind:innerHTML={cell} />
			{/each}
		</tr>
	{/each}
</table>

<div class="actionbuttons">
	<button name="Accept" on:click={() => console.log("Accept")}
		>✔️Accept</button
	>
	<button name="Cancel" on:click={() => console.log("Cancel")}
		>❌Cancel</button
	>
</div>

<style>
	.actionbuttons {
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
