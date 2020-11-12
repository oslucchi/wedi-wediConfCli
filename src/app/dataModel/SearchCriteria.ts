export class SearchCriteria {
	 trayType: string;
	 screedThickness: number;
	 wMin: number;
	 lMin: number;
	 profiles: {
		est: string;
		west: string;
		north: string;
		tileHeight: number;
	};
	public constructor() {
		this.profiles = {est: "floor", west: "wall", north:"wall", tileHeight: 0};
	}
}
