// FIXME Remove!
/// <reference path="./pg-query-native.d.ts" />

import * as fs from 'fs'
import * as ts from 'typescript'
import * as pg from 'pg-query-native'
import {pool} from './pool'
import {pgToJsType} from './pg-types'
import {filesEndingWith} from '../../shared/filesEndingWith'

const program = ts.createProgram([], {})
const typeChecker = program.getTypeChecker()

export function lintFile(sourceFile: ts.SourceFile) {
    lintNode(sourceFile)

    function lintNode(node: ts.Node) {
        if (node.kind === ts.SyntaxKind.Identifier
            && node.getText() === 'ssql'
            && ts.isTaggedTemplateExpression(node.parent)) {
            const parent = node.parent as ts.TaggedTemplateExpression

            let querySrc = parent.template.getText()
            let query: string
            while (true) {
                try {
                    query = eval(querySrc)
                    break
                } catch (err) {
                    // TODO A function could be used inside the placeholders...
                    if (err instanceof ReferenceError) {
                        const undefinedVar = err.message.split(' ')[0]
                        if (!/^[_a-zA-Z][_a-zA-Z0-9]+$/.test(undefinedVar)) {
                            console.warn(`Failed to capture undefined variable in query. Captured value: "${undefinedVar}".`)
                            return
                        }
                        querySrc = `let ${undefinedVar} = null; ` + querySrc
                        continue
                    }
                    console.warn(`Failed to evaluate query source in ${nodeRef(node)}: ${err.message}`)
                    return
                }
            }

            const {query: ast, error: err} = pg.parse(query)
            if (err) {
                console.error(
                    `Syntactic error in ${nodeRef(node)}: ${err.message}`,
                    errMsg(query, err.cursorPosition - 1)
                )
                return
            }

            pool.query('explain (verbose true) ' + query)
                .then(() => {
                    if (ast[0].SelectStmt) {
                        pool.query(`select * from (${query}) x limit 0`).then(res => {
                            // TODO Verify the function's declared return type and the actual return type match.
                            console.debug(
                                res.fields.map(f => ({
                                    name: f.name,
                                    type: pgToJsType[f.dataTypeID]
                                }))
                            )

                            // FIXME Gives `TypeError: Cannot read property 'exports' of undefined` from deep inside TypeScript.
                            const signature = typeChecker.getResolvedSignature(parent)
                            console.debug('signature', signature)

                            // const type = typeChecker.getTypeFromTypeNode(node.typeArguments[0])
                            // const properties = typeChecker.getPropertiesOfType(type)
                            // typeChecker.typeToString(signature.getReturnType())
                        })
                        .catch(console.error)
                    }
                })
                .catch((err: Error & {position: number}) => {
                    console.error(
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

    // TODO Remove $HOME from filename.
    function nodeRef(node: ts.Node) {
        const {line, character} = sourceFile.getLineAndCharacterOfPosition(node.getStart())
        return `${sourceFile.fileName}:${line + 1}:${character + 1}`
    }
}

for (const fileName of filesEndingWith(__dirname, '.ts')) {
    lintFile(
        ts.createSourceFile(
            fileName,
            fs.readFileSync(fileName).toString(),
            ts.ScriptTarget.ES2015,
            true
        )
    )
}
