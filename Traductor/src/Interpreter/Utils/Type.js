/**
 * @typedef {Object} TypeEntry
 * @property {string} value - Valor textual del tipo.
 * @property {number} ord - Orden o prioridad del tipo.
 */

/**
 * @enum {TypeEntry}
 */

const Type = {
    INT:     {value: 'int',   typeDest: 'int',     ord: 0},
    FLOAT:   {value: 'float', typeDest: 'float64', ord: 1},
    STRING:  {value: 'Str',   typeDest: 'string',  ord: 2},
    BOOLEAN: {value: 'bool',  typeDest: 'bool',    ord: 3},
    CHAR:    {value: 'char',  typeDest: 'rune',    ord: 4},
}

export default Type;