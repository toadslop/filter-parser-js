import { Scanner } from '../index';
import { CompOp } from './compOp';
import { Comparison } from './comparison';
import { FieldName } from './fieldName';
import { Literal } from './literal';
import { LogicOp } from './logicOp';
import { Logical } from './logical';
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
			new ParseError('expected-comparison-op', 2, tokens)
		);
	});

	test('throws error with invalid op', () => {
		const scanner = new Scanner('name eq Tom');
		const tokens = scanner.scanTokens();
		const parser = new Parser(tokens);

		expect(() => parser.parse()).toThrowError(
			new ParseError('expected-literal', 3, tokens)
		);
	});

	test("parses logical operators: \"firstName eq 'Tom' and lastName eq 'Bombadil'\" correctly", () => {
		const scanner = new Scanner(
			"firstName eq 'Tom' and lastName eq 'Bombadil'"
		);
		const tokens = scanner.scanTokens();
		const ast = new Parser(tokens).parse();

		const left = new Comparison(
			new FieldName('firstName'),
			new CompOp('eq'),
			new Literal('Tom')
		);

		const right = new Comparison(
			new FieldName('lastName'),
			new CompOp('eq'),
			new Literal('Bombadil')
		);

		const expected = new Logical(left, new LogicOp('and'), right);

		expect(ast).toEqual(expected);
	});
});
