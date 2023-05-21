import { Predicate } from './predicate';

export class Expression {
	expressionType: Predicate;
	constructor(predicate: Predicate) {
		this.expressionType = predicate;
	}
}
