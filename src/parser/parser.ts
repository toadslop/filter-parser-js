import { Token } from '../scanner/token';
import { CompOp } from './compOp';
import { Comparison } from './comparison';
import { Expr } from './expression';
import { FieldName } from './fieldName';
import { Grouping } from './grouping';
import { Literal } from './literal';
import { LogicOp } from './logicOp';
import { Logical } from './logical';
import { Unary } from './unary';
import { UnaryOp } from './unaryOp';

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
		return this.logical();
	}

	private logical(): Expr {
		let expr = this.unary();

		while (this.match(LogicOp.types)) {
			const op = this.logicOp();
			const right = this.unary();
			expr = new Logical(expr, op, right);
		}

		return expr;
	}

	private match(tokens: Set<string>): boolean {
		return tokens.has(this.peek().lexeme);
	}

	private peek(): Token {
		return this.tokens[this.current] as Token;
	}
	private unary(): Expr {
		if (UnaryOp.types.has(this.peek().lexeme)) {
			const op = this.unaryOp();
			const grouping = this.grouping();
			return new Unary(op, grouping);
		} else {
			return this.comparison();
		}
	}

	private logicOp(): LogicOp {
		const token = this.advance();
		if (token.type !== 'IDENT')
			throw new ParseError('expected-ident', this.current, this.tokens);
		if (!LogicOp.types.has(token.lexeme))
			throw new ParseError('expected-logic-op', this.current, this.tokens);
		return new LogicOp(token.lexeme);
	}
	private unaryOp(): UnaryOp {
		const token = this.advance();
		if (token.type !== 'IDENT')
			throw new ParseError('expected-ident', this.current, this.tokens);
		if (!UnaryOp.types.has(token.lexeme))
			throw new ParseError('expected-unary-op', this.current, this.tokens);
		return new UnaryOp(token.lexeme);
	}
	private grouping(): Expr {
		const openParenToken = this.advance();
		if (openParenToken.type !== 'LEFT_PAREN')
			throw new ParseError('expected-left-paren', this.current, this.tokens);
		const expr = this.logical();
		const closeParenToken = this.advance();

		if (closeParenToken.type !== 'RIGHT_PAREN')
			throw new ParseError('expected-right-paren', this.current, this.tokens);

		return new Grouping(expr);
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
			throw new ParseError('expected-ident', this.current, this.tokens);

		return new FieldName(token.lexeme);
	}

	private compOp(): CompOp {
		const token = this.advance();
		if (token.type !== 'IDENT')
			throw new ParseError('expected-ident', this.current, this.tokens);
		if (!CompOp.types.has(token.lexeme))
			throw new ParseError('expected-comparison-op', this.current, this.tokens);
		return new CompOp(token.lexeme);
	}

	private literal(): Literal {
		const token = this.advance();

		if (
			token.type !== 'NUMBER' &&
			token.type !== 'DATE' &&
			token.type !== 'STRING'
		)
			throw new ParseError('expected-literal', this.current, this.tokens);

		return new Literal(token.literal);
	}

	private advance(): Token {
		if (!this.isAtEnd()) this.current++;
		return this.previous();
	}

	private isAtEnd(): boolean {
		return this.peek().type == 'END_OF_STRING';
	}

	private previous(): Token {
		return this.tokens[this.current - 1] as Token;
	}
}

type ParseErrorType =
	| 'expected-ident'
	| 'expected-comparison-op'
	| 'expected-logic-op'
	| 'expected-unary-op'
	| 'expected-literal'
	| 'expected-left-paren'
	| 'expected-right-paren';

export class ParseError extends Error {
	constructor(errorType: ParseErrorType, idx: number, tokens: Token[]) {
		let message;
		idx = idx - 1;
		const lexeme = tokens[idx]?.lexeme;

		switch (errorType) {
			case 'expected-ident':
				message = `Expected identifier at position ${idx} but got ${lexeme}`;
				break;
			case 'expected-comparison-op':
				message = `Expected a comparison operator at position ${idx} but got ${lexeme}`;
				break;
			case 'expected-literal':
				message = `Expected a literal at position ${idx} but got ${lexeme}`;
				break;
			case 'expected-left-paren':
				message = `Expected a left paren at position ${idx} but got ${lexeme}`;
				break;
			case 'expected-right-paren':
				message = `Expected a right paren at position ${idx} but got ${lexeme}`;
				break;
			case 'expected-logic-op':
				message = `Expected a logic op at position ${idx} but got ${lexeme}`;
				break;
			case 'expected-unary-op':
				message = `Expected a unary op at position ${idx} but got ${lexeme}`;
				break;
			default:
				message = 'An known parsing error occurred.';
				break;
		}

		super(message);
	}
}
