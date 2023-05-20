export type TokenType =
	| 'LEFT_PAREN'
	| 'RIGHT_PAREN'
	| 'IDENT'
	| 'STRING'
	| 'NUMBER'
	| 'DATE'
	| 'END_OF_STRING'
	| 'COMMA';

export type TokenLiteral = string | number | Date | null;

export class Token {
	readonly type: TokenType;
	readonly lexeme: string;
	readonly literal: TokenLiteral;
	readonly start: number;

	constructor(
		type: TokenType,
		lexeme: string,
		literal: TokenLiteral,
		start: number
	) {
		this.type = type;
		this.lexeme = lexeme;
		this.literal = literal;
		this.start = start;
	}

	public toString(): string {
		return `${this.type} ${this.lexeme} ${this.literal}`;
	}
}
