import { Scanner } from '../index';
import { Parser } from './parser';

describe('parser tests', () => {
	test('parses __ correctly', () => {
		const scanner = new Scanner("name eq 'Tom'");
		const tokens = scanner.scanTokens();
		const ast = new Parser();
		expect(ast).toEqual({
			subject: 'name',
			op: 'eq',
			value: 'Tom',
		});
	});
});
