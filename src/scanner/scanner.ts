import { Token, TokenLiteral, TokenType } from './token';

export default class Scanner {
	private static readonly STRING_DELIMETER = "'";
	private static validFollowers = new Set<string>([' ', ')', '(', ',']);

	private readonly source: string;
	private readonly tokens: Token[] = [];
	private start = 0;
	private current = this.start;

	constructor(source: string) {
		this.source = source;
	}

	public scanTokens(): Token[] {
		while (!this.isAtEnd()) {
			this.start = this.current;
			this.scanToken();
		}

		this.tokens.push(new Token('END_OF_STRING', '', null, this.start));
		return this.tokens;
	}

	private scanToken() {
		const c = this.advance();
		switch (c) {
			case '(':
				this.addToken('LEFT_PAREN');
				break;
			case ')':
				this.addToken('RIGHT_PAREN');
				break;
			case ',':
				this.addToken('COMMA');
				break;
			case Scanner.STRING_DELIMETER:
				this.string();
				break;
			case ' ':
				return;
			default:
				if (this.isDigit(c)) {
					if (
						this.isDigit(this.peek(0)) &&
						this.isDigit(this.peek(1)) &&
						this.isDigit(this.peek(2)) &&
						this.peek(3) === '-'
					) {
						this.date();
					} else {
						this.number();
					}
				} else if (this.isAlpha(c)) {
					this.identifier();
				} else {
					throw new ScanError(
						this.source.substring(this.current - 1, this.current + 1),
						this.start,
						'invalid-character'
					);
				}
		}
	}

	private addToken(type: TokenType): void;
	private addToken(type: TokenType, literal: TokenLiteral): void;
	private addToken(type: TokenType, literal?: TokenLiteral): void {
		const text = this.source.substring(this.start, this.current);
		this.tokens.push(new Token(type, text, literal || null, this.start));
	}

	// Source handling

	private advance(): string {
		return this.source.charAt(this.current++);
	}

	private peek(lookahead = 0): string {
		const lookaheadIdx = this.current + lookahead;
		if (lookaheadIdx >= this.source.length) return '\0';
		return this.source.charAt(lookaheadIdx);
	}

	private scanNumber(): void {
		while (this.isDigit(this.peek())) this.advance();
	}

	// Token Parsing
	private date(): void {
		while (this.peek() !== 'Z' && !this.isAtEnd()) {
			this.advance();
		}
		this.advance();

		const dateString = this.source.substring(this.start, this.current);
		const date = new Date(dateString);
		if (date.toString() === 'Invalid Date')
			throw new ScanError(dateString, this.start, 'invalid-date');

		this.tokens.push(new Token('DATE', dateString, date, this.start));
		this.validFollowerChar();
	}

	private identifier(): void {
		while (this.isValidIdentChar(this.peek())) this.advance();
		this.addToken('IDENT');
		this.validFollowerChar();
	}

	private number(): void {
		this.scanNumber();

		if (this.peek() === '.' && this.isDigit(this.peek(1))) {
			this.advance();

			this.scanNumber();
		}

		this.addToken(
			'NUMBER',
			Number(this.source.substring(this.start, this.current))
		);
		this.validFollowerChar();
	}

	private string(): void {
		while (this.peek() !== Scanner.STRING_DELIMETER && !this.isAtEnd()) {
			this.advance();
		}

		if (this.isAtEnd()) {
			throw new ScanError(
				this.source.substring(this.start, this.current),
				this.start,
				'unterminated-string'
			);
		}

		this.advance();

		const value = this.source.substring(this.start + 1, this.current - 1);
		this.addToken('STRING', value);
		this.validFollowerChar();
	}

	// Helper Methods

	private isAtEnd(): boolean {
		return this.current >= this.source.length;
	}

	private isDigit(c: string): boolean {
		return c >= '0' && c <= '9';
	}

	private validFollowerChar(): void {
		if (!this.isAtEnd() && !Scanner.validFollowers.has(this.peek())) {
			throw new ScanError(
				this.source.substring(this.current, this.current + 1),
				this.current,
				'delimiter-error'
			);
		}
	}

	private isAlpha(c: string): boolean {
		return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
	}

	private isAlphaNumeric(c: string): boolean {
		return this.isAlpha(c) || this.isDigit(c);
	}

	private isValidIdentChar(c: string): boolean {
		return this.isAlphaNumeric(c) || c === '-' || c === '.';
	}
}

type ScanErrorType =
	| 'unterminated-string'
	| 'invalid-character'
	| 'invalid-date'
	| 'delimiter-error';

export class ScanError extends Error {
	constructor(errorString: string, idx: number, type: ScanErrorType) {
		let message;

		switch (type) {
			case 'unterminated-string':
				message = `Unterminated string detected: ${errorString} at index ${idx}`;
				break;
			case 'invalid-character':
				message = `Encountered invalid character: ${errorString} at index ${idx}`;
				break;
			case 'invalid-date':
				message = `Invalid date detected: ${errorString} at index ${idx}`;
				break;
			case 'delimiter-error':
				message = `Improper delimeter detected: ${errorString} at index ${idx}`;
				break;
			default:
				message = `Unknown error occured at ${errorString} at index ${idx}`;
				break;
		}

		super(message);
	}
}
