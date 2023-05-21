expression → binary
| logical
| unary
| grouping ;
binary → ident operator literal ;
grouping → "(" expression ")" ;
logical → expression logicop expression ;
ident → ^[a-zA-Z][a-zA-Z0-9.-_]\*$ ;
operator → "eq" | "ne" | "lt" | "le" | "gt" | "ge" | "startsWith" ;
literal → NUMBER | STRING | "true" | "false" | "null" ;
logicop → "and" | "or" ;
unary → "not" "(" expression ")";

expression → unary
| binary
| grouping
| function
| literal
| ident ;
predicate →
literal → NUMBER | STRING | "true" | "false" | "null" ;
grouping → "(" expression ")" ;
unary → "not" "(" expression ")";
binary → predicate operator predicate ;
operator → "eq" | "ne" | "lt" | "le" | "gt" | "ge"
| "startsWith";
function → "contains(" ident "," literal ")" ;
ident → ^[a-zA-Z][a-zA-Z0-9.-_]\*$
