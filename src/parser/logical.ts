import { Expr } from './expression';
import { LogicOp } from './logicOp';

export class Logical {
	readonly leftExpr: Expr;
	readonly logicOp: LogicOp;
	readonly rightExpr: Expr;

	constructor(leftExpr: Expr, logicOp: LogicOp, rightExpr: Expr) {
		this.leftExpr = leftExpr;
		this.logicOp = logicOp;
		this.rightExpr = rightExpr;
	}
}
