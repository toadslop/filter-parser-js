import { Expr } from './expression';

export class UnaryOp extends Expr {
	readonly op: string;

	static readonly types = new Set(['not']);

	constructor(op: string) {
		super();
		this.op = op;
	}
}
