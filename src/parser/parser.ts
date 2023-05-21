import { Token } from '../scanner/token';
import { CompOp } from './compOp';
import { Comparison } from './comparison';
import { Expr } from './expression';
import { FieldName } from './fieldName';
import { Literal } from './literal';

export class Parser {
	private readonly tokens: Token[];
	private current = 0;

	constructor(tokens: Token[]) {
		this.tokens = tokens;
	}

	public parse(): Expr {
		return this.expression();
	}

	private expression(): Expr {
		return this.comparison();
	}

	private comparison(): Expr {
		const fieldName = this.fieldName();
		const compOp = this.compOp();
		const liter = this.literal();

		return new Comparison(fieldName, compOp, liter);
	}

	private fieldName(): FieldName {
		const token = this.advance();

		if (token.type !== 'IDENT')
			throw new ParseError('expected-ident', this.current);

		return new FieldName(token.lexeme);
	}

	private compOp(): CompOp {
		const token = this.advance();
		if (token.type !== 'IDENT')
			throw new ParseError('expected-ident', this.current);
		if (!CompOp.types.has(token.lexeme))
			throw new ParseError('invalid-ident', this.current);
		return new CompOp(token.lexeme);
	}

	private literal(): Literal {
		const token = this.advance();

		if (
			token.type !== 'NUMBER' &&
			token.type !== 'DATE' &&
			token.type !== 'STRING'
		)
			throw new ParseError('expected-literal', this.current);

		return new Literal(token.literal);
	}

	// private match(...types: enum): boolean {
	// 	for (const type of types) {
	// 		if (this.check(type)) {
	// 			this.advance();
	// 			return true;
	// 		}
	// 	}

	// 	return false;
	// }

	// private check(type: Operator | LogicOp): boolean {
	// 	if (this.isAtEnd()) return false;
	// 	return this.peek().lexeme == type;
	// }

	private advance(): Token {
		if (!this.isAtEnd()) this.current++;
		return this.previous();
	}

	private isAtEnd(): boolean {
		return this.peek().type == 'END_OF_STRING';
	}

	private peek(): Token {
		return this.tokens[this.current] as Token;
	}

	private previous(): Token {
		return this.tokens[this.current - 1] as Token;
	}
}

type ParseErrorType = 'expected-ident' | 'invalid-ident' | 'expected-literal';

export class ParseError extends Error {
	constructor(errorType: ParseErrorType, idx: number) {
		let message;

		switch (errorType) {
			case 'expected-ident':
				message = `Expected identifier at position ${idx}`;
				break;
			case 'invalid-ident':
				message = `Expected a comparison operator at position ${idx - 1}`;
				break;
			case 'expected-literal':
				message = `Expected a literal at position ${idx}`;
				break;
			default:
				break;
		}

		super(message);
	}
}
