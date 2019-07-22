// FIXME Remove!
/// <reference path="./pg-query-native.d.ts" />

import * as fs from 'fs'
import * as ts from 'typescript'
import * as pg from 'pg-query-native'
// import {filesEndingWith} from '../../shared/filesEndingWith'
import {log} from './log'
import {pool} from './pool'

import {PgTypeId} from './PgTypeId'
import {Constructor} from './Constructor'
import {WrapperType} from './WrapperType'
import {Column} from './Table'

// TODO Move somewhere else.
const pgToJsType: {[pgTypeId: number]: Constructor<WrapperType<Exclude<Column, null>>>} = {
    [PgTypeId.BOOL]: Boolean,
    [PgTypeId.INT2]: Number,
    [PgTypeId.INT4]: Number,
    [PgTypeId.INT8]: Number,
    [PgTypeId.FLOAT4]: Number,
    [PgTypeId.FLOAT8]: Number,
    [PgTypeId.NUMERIC]: Number,
    [PgTypeId.TEXT]: String,
    [PgTypeId.CHAR]: String,
    [PgTypeId.BPCHAR]: String,
    [PgTypeId.VARCHAR]: String,
    [PgTypeId.DATE]: Date,
    [PgTypeId.TIMESTAMP]: Date,
    [PgTypeId.TIMESTAMPTZ]: Date,
    [PgTypeId.BYTEA]: Uint8Array
}

export function lintFile(sourceFile: ts.SourceFile) {
    lintNode(sourceFile)

    function lintNode(node: ts.Node) {
        if (node.kind === ts.SyntaxKind.Identifier
            && node.getText() === 'query'
            && node.parent.kind === ts.SyntaxKind.CallExpression) {
            const fnCall = node.parent as ts.CallExpression
            const querySrc = fnCall.arguments[0].getText()

            // TODO Query could be stored in a variable.
            // TODO Query string could contain placeholders, e.g. `${t}`.
            // IDEA Use tagged strings, e.g. sql`select 1`.

            let query: string
            try {
                query = eval(querySrc)
            } catch (err) {
                log.warn(`Failed to evaluate query source in ${nodeRef(node)}: ${err.message}`)
                return
            }

            const {query: ast, error: err} = pg.parse(query)
            if (err) {
                log.error(
                    `Syntactic error in ${nodeRef(node)}: ${err.message}`,
                    errMsg(query, err.cursorPosition - 1)
                )
                return
            }

            pool.query('explain (verbose true) ' + query)
                .then(() => {
                    if (ast[0].SelectStmt) {
                        // TODO Replace all placeholders with `null`.
                        pool.query(`select * from (${query}) x limit 0`).then(res => {
                            console.debug(res.fields)
                            console.debug(
                                res.fields.map(f => ({
                                    // f.tableID, f.columnID // Can be 0.
                                    name: f.name,
                                    type: pgToJsType[f.dataTypeID]
                                }))
                            )
                        })
                        .catch(log.error)
                    }
                })
                .catch((err: Error & {position: number}) => {
                    log.error(
                        `Semantic error in ${nodeRef(node)}: ${err.message}`,
                        errMsg(query, err.position - 1)
                    )
                    return
                })
        }

        ts.forEachChild(node, lintNode)
    }

    // TODO Ensure double vertical spacing and four spaces of indentation.
    function errMsg(query: string, errPos?: number): string {
        if (!errPos || errPos >= query.length) {
            return '\n\x1b[31m' + query + '\x1b[0m\n'
        }
        return '\n\x1b[31m' + query.substr(0, errPos) + '\x1b[0m'
            + '\x1b[103m' + '\x1b[31m' + query[errPos] + '\x1b[0m' + '\x1b[0m'
            + '\x1b[31m' + query.substr(errPos + 1) + '\x1b[0m\n'
    }

    function nodeRef(node: ts.Node) {
        const {line, character} = sourceFile.getLineAndCharacterOfPosition(node.getStart())
        return `${sourceFile.fileName}:${line + 1}:${character + 1}`
    }
}

for (const fileName of [__dirname + '/api/getCurrentUser.ts'] /* filesEndingWith(__dirname, '.ts') */) {
    lintFile(
        ts.createSourceFile(
            fileName,
            fs.readFileSync(fileName).toString(),
            ts.ScriptTarget.ES2015,
            /* setParentNodes */ true
        )
    )
}
