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
		this.trayType = "P";
		this.screedThickness = 200;
		this.wMin = 900;
		this.lMin = 1400;
		this.profiles = {est: "floor", west: "wall", north:"wall", tileHeight: 10};
	}
}
