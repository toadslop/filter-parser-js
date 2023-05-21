import { Expr } from './expression';

export class FieldName extends Expr {
	name: string;

	constructor(name: string) {
		super();
		this.name = name;
	}
}
