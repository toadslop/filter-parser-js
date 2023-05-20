import Scanner from './scanner';
import { TokenType } from './token';

describe('scanner module', () => {
	test('scans parens correctly', () => {
		const scanner = new Scanner('())');
		const tokens = scanner.scanTokens();
		expect(tokens.length).toBe(4);
		expect(tokens[0]?.type).toBe('LEFT_PAREN' as TokenType);
		expect(tokens[1]?.type).toBe('RIGHT_PAREN' as TokenType);
		expect(tokens[2]?.type).toBe('RIGHT_PAREN' as TokenType);
		expect(tokens[3]?.type).toBe('END_OF_STRING' as TokenType);
	});

	test('correctly identifies strings', () => {
		const scanner = new Scanner("'is a string'");
		const tokens = scanner.scanTokens();
		const stringToken = tokens[0];
		expect(stringToken?.lexeme).toBe("'is a string'" as TokenType);
		expect(stringToken?.literal).toBe('is a string' as TokenType);
		expect(stringToken?.type).toBe('STRING' as TokenType);
	});

	test('throws on unterminated strings', () => {
		const scanner = new Scanner("'unterminated ");

		expect(() => scanner.scanTokens()).toThrowError(
			"Unterminated string detected: 'unterminated"
		);
	});

	test('throws on invalid characters', () => {
		const scanner = new Scanner(' % ');

		expect(() => scanner.scanTokens()).toThrowError(
			'Encountered invalid character: %'
		);
	});

	test('parses an integer', () => {
		const scanner = new Scanner('1');
		const tokens = scanner.scanTokens();
		const numberToken = tokens[0];
		expect(numberToken?.literal).toBe(1);
		expect(numberToken?.lexeme).toBe('1');
		expect(numberToken?.type).toBe('NUMBER' as TokenType);
	});

	test('parses a decimal', () => {
		const scanner = new Scanner('1.1');
		const tokens = scanner.scanTokens();
		const numberToken = tokens[0];
		expect(numberToken?.literal).toBe(1.1);
		expect(numberToken?.lexeme).toBe('1.1');
		expect(numberToken?.type).toBe('NUMBER' as TokenType);
	});

	test('parses an identifier', () => {
		const scanner = new Scanner('name');
		const tokens = scanner.scanTokens();
		const literalToken = tokens[0];
		expect(literalToken?.lexeme).toBe('name');
		expect(literalToken?.type).toBe('IDENT' as TokenType);
	});

	test('parses a string of Japanese characters', () => {
		const scanner = new Scanner("'納豆'");
		const tokens = scanner.scanTokens();
		const literalToken = tokens[0];
		expect(literalToken?.literal).toBe('納豆');
		expect(literalToken?.lexeme).toBe("'納豆'");
		expect(literalToken?.type).toBe('STRING' as TokenType);
	});

	test('parses a date', () => {
		const dateString = '2018-02-13T12:33:12Z';
		const scanner = new Scanner(dateString);
		const tokens = scanner.scanTokens();
		const literalToken = tokens[0];
		expect(literalToken?.literal).toEqual(new Date(dateString));
		expect(literalToken?.lexeme).toBe(dateString);
		expect(literalToken?.type).toBe('DATE' as TokenType);
	});

	test('correctly parses "addressLocality eq \'Redmond\'"', () => {
		const scanner = new Scanner("addressLocality eq 'Redmond'");
		const tokens = scanner.scanTokens();

		expect(tokens.length).toBe(4);

		const fieldToken = tokens[0];
		expect(fieldToken?.literal).toEqual(null);
		expect(fieldToken?.lexeme).toBe('addressLocality');
		expect(fieldToken?.type).toBe('IDENT' as TokenType);

		const opToken = tokens[1];
		expect(opToken?.literal).toEqual(null);
		expect(opToken?.lexeme).toBe('eq');
		expect(opToken?.type).toBe('IDENT' as TokenType);

		const valueToken = tokens[2];
		expect(valueToken?.literal).toEqual('Redmond');
		expect(valueToken?.lexeme).toBe("'Redmond'");
		expect(valueToken?.type).toBe('STRING' as TokenType);
	});

	test('correctly parses "price gt 20"', () => {
		const scanner = new Scanner('price gt 20');
		const tokens = scanner.scanTokens();

		expect(tokens.length).toBe(4);

		const fieldToken = tokens[0];
		expect(fieldToken?.literal).toEqual(null);
		expect(fieldToken?.lexeme).toBe('price');
		expect(fieldToken?.type).toBe('IDENT' as TokenType);

		const opToken = tokens[1];
		expect(opToken?.literal).toEqual(null);
		expect(opToken?.lexeme).toBe('gt');
		expect(opToken?.type).toBe('IDENT' as TokenType);

		const valueToken = tokens[2];
		expect(valueToken?.literal).toEqual(20);
		expect(valueToken?.lexeme).toBe('20');
		expect(valueToken?.type).toBe('NUMBER' as TokenType);
	});

	test('correctly parses "dateCreated lt 2018-02-13T12:33:12Z', () => {
		const scanner = new Scanner('dateCreated lt 2018-02-13T12:33:12Z');
		const tokens = scanner.scanTokens();

		expect(tokens.length).toBe(4);

		const fieldToken = tokens[0];
		expect(fieldToken?.literal).toEqual(null);
		expect(fieldToken?.lexeme).toBe('dateCreated');
		expect(fieldToken?.type).toBe('IDENT' as TokenType);

		const opToken = tokens[1];
		expect(opToken?.literal).toEqual(null);
		expect(opToken?.lexeme).toBe('lt');
		expect(opToken?.type).toBe('IDENT' as TokenType);

		const valueToken = tokens[2];
		expect(valueToken?.literal).toEqual(new Date('2018-02-13T12:33:12Z'));
		expect(valueToken?.lexeme).toBe('2018-02-13T12:33:12Z');
		expect(valueToken?.type).toBe('DATE' as TokenType);
	});

	test("correctly parses \"startswith(addressLocality, 'Lond')", () => {
		const scanner = new Scanner("startswith(addressLocality, 'Lond')");
		const tokens = scanner.scanTokens();

		expect(tokens.length).toBe(7);

		const funcNameToken = tokens[0];
		expect(funcNameToken?.literal).toEqual(null);
		expect(funcNameToken?.lexeme).toBe('startswith');
		expect(funcNameToken?.type).toBe('IDENT' as TokenType);

		const leftParenToken = tokens[1];
		expect(leftParenToken?.literal).toEqual(null);
		expect(leftParenToken?.lexeme).toBe('(');
		expect(leftParenToken?.type).toBe('LEFT_PAREN' as TokenType);

		const opToken = tokens[2];
		expect(opToken?.literal).toEqual(null);
		expect(opToken?.lexeme).toBe('addressLocality');
		expect(opToken?.type).toBe('IDENT' as TokenType);

		const commaToken = tokens[3];
		expect(commaToken?.literal).toEqual(null);
		expect(commaToken?.lexeme).toBe(',');
		expect(commaToken?.type).toBe('COMMA' as TokenType);

		const valueToken = tokens[4];
		expect(valueToken?.literal).toEqual('Lond');
		expect(valueToken?.lexeme).toBe("'Lond'");
		expect(valueToken?.type).toBe('STRING' as TokenType);

		const rightParenToken = tokens[5];
		expect(rightParenToken?.literal).toEqual(null);
		expect(rightParenToken?.lexeme).toBe(')');
		expect(rightParenToken?.type).toBe('RIGHT_PAREN' as TokenType);
	});

	test('correctly parses a filter on a nested field', () => {
		const scanner = new Scanner("childObject.id eq '12345'");
		const tokens = scanner.scanTokens();

		expect(tokens.length).toBe(4);

		const fieldToken = tokens[0];
		expect(fieldToken?.literal).toEqual(null);
		expect(fieldToken?.lexeme).toBe('childObject.id');
		expect(fieldToken?.type).toBe('IDENT' as TokenType);
	});

	test('correctly parses logical and', () => {
		const scanner = new Scanner('price le 200 and price gt 3.5');
		const tokens = scanner.scanTokens();

		expect(tokens.length).toBe(8);

		const andToken = tokens[3];
		expect(andToken?.literal).toEqual(null);
		expect(andToken?.lexeme).toBe('and');
		expect(andToken?.type).toBe('IDENT' as TokenType);
	});
});
