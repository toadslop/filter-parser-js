import { Token } from '../scanner/token';

export class Parser {
	private readonly tokens: Token[];
	private current = 0;

	constructor(tokens: Token[]) {
		this.tokens = tokens;
	}
}
