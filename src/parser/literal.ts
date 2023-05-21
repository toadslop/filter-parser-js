type LiteralTypes = string | number | Date | boolean | null;

export class Literal {
	value: LiteralTypes;

	constructor(value: LiteralTypes) {
		this.value = value;
	}
}
