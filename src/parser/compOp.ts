import { Expr } from './expression';

export class CompOp extends Expr {
	readonly op: string;

	static readonly types = new Set([
		'eq',
		'ne',
		'gt',
		'ge',
		'lt',
		'le',
		'startsWith',
	]);

	constructor(op: string) {
		super();
		this.op = op;
	}
}
