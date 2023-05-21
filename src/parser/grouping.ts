import { Expr } from './expression';

export class Grouping extends Expr {
	readonly expression: Expr;

	constructor(expression: Expr) {
		super();
		this.expression = expression;
	}
}
