import { Literal } from './literal';
import { Operator } from './operators';

export class Predicate {
	readonly subject: string | Predicate;
	readonly op: Operator;
	readonly value: Literal | Predicate;

	constructor(
		subject: string | Predicate,
		op: Operator,
		value: Literal | Predicate
	) {
		this.subject = subject;
		this.op = op;
		this.value = value;
	}
}
