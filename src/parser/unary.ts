import { Expr } from './expression';
import { UnaryOp } from './unaryOp';

export class Unary {
	readonly unaryOp: UnaryOp;
	readonly rightExpr: Expr;

	constructor(logicOp: UnaryOp, rightExpr: Expr) {
		this.unaryOp = logicOp;
		this.rightExpr = rightExpr;
	}
}
