import { Expr } from './expression';

export class LogicOp extends Expr {
	readonly op: string;

	static readonly types = new Set(['and', 'or']);

	constructor(op: string) {
		super();
		this.op = op;
	}
}
