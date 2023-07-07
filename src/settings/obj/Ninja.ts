
export class Ninja {
	constructor() {
	}
	public static hidePath(path: string) {
		this.changePathVisibility(path, true)
	}
	public static unhidePath(path: string) {
		this.changePathVisibility(path, false);
	}
	public static changePathVisibility(path: string, hide: boolean) {
		const n = document.querySelector(`[data-path="${path}"]`);
		if (!n) {
			return;
		}
		const p = n.parentElement
		if (p) {
			if (hide) {
				p.style.display = `none`
			} else {
				p.style.display = ``;
			}
		}
	}
}

