import { Scanner } from '../index';
import { CompOp } from './compOp';
import { Comparison } from './comparison';
import { FieldName } from './fieldName';
import { Literal } from './literal';
import { ParseError, Parser } from './parser';

describe('parser tests', () => {
	test('parses "name eq \'Tom\'" correctly', () => {
		const scanner = new Scanner("name eq 'Tom'");
		const tokens = scanner.scanTokens();
		const ast = new Parser(tokens).parse();

		const expected = new Comparison(
			new FieldName('name'),
			new CompOp('eq'),
			new Literal('Tom')
		);

		expect(ast).toEqual(expected);
	});

	test('throws error with invalid op', () => {
		const scanner = new Scanner("name and 'Tom'");
		const tokens = scanner.scanTokens();
		const parser = new Parser(tokens);

		expect(() => parser.parse()).toThrowError(
			new ParseError('invalid-ident', 2)
		);
	});

	test('throws error with invalid op', () => {
		const scanner = new Scanner('name eq Tom');
		const tokens = scanner.scanTokens();
		const parser = new Parser(tokens);

		expect(() => parser.parse()).toThrowError(
			new ParseError('expected-literal', 3)
		);
	});

	test("parses logical operators: \"firstName eq 'Tom' and lastName eq 'Bombadil'\" correctly", () => {
		const scanner = new Scanner("fistName eq 'Tom' and lastName eq 'Bombadil'");
		const tokens = scanner.scanTokens();
		const ast = new Parser(tokens).parse();

		const expected = new Comparison(
			new FieldName('name'),
			new CompOp('eq'),
			new Literal('Tom')
		);

		expect(ast).toEqual(expected);
	});
});
