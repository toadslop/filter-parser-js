import { CompOp } from './compOp';
import { Expr } from './expression';
import { FieldName } from './fieldName';
import { Literal } from './literal';

export class Comparison extends Expr {
	readonly fieldName: FieldName;
	readonly operator: CompOp;
	readonly value: Literal;

	constructor(fieldName: FieldName, operator: CompOp, value: Literal) {
		super();

		this.fieldName = fieldName;
		this.operator = operator;
		this.value = value;
	}
}
