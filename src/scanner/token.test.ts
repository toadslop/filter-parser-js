import { Token } from './token';

describe('token module', () => {
	test('converts LEFT_PAREN to string properly', () => {
		const token = new Token('LEFT_PAREN', '(', null, 0);
		const asString = token.toString();
		expect(asString).toBe('LEFT_PAREN ( null');
	});
});
