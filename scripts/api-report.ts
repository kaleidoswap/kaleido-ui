/**
 * The package's public API, as a committed list.
 *
 * Every entry point in package.json's `exports`, read from the BUILT package
 * (`dist/`, so run `npm run build` first) the way an app installing it sees it:
 *
 * - a JavaScript entry: each export's name and kind, read from its `.d.ts`;
 * - a stylesheet: the custom properties it declares;
 * - a wildcard (`./brand/*`): the files it matches.
 *
 * `api/exports.txt` is that list. CI regenerates it and fails on any
 * difference, so an export added, removed or renamed shows up in the pull
 * request as a diff in one file rather than in a consumer's build.
 *
 *   npm run check:api    fails when api/exports.txt is out of date
 *   npm run api:update   rewrites it; commit the result
 */
import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import ts from 'typescript'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const REPORT = join(ROOT, 'api', 'exports.txt')

type Target = string | { types?: string; import?: string; default?: string }
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')) as {
  name: string
  exports: Record<string, Target>
}

const byText = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0)

const kindOf = (symbol: ts.Symbol, checker: ts.TypeChecker): string => {
  const flags = symbol.flags
  if (flags & ts.SymbolFlags.Class) return 'class'
  if (flags & ts.SymbolFlags.Enum) return 'enum'
  if (flags & ts.SymbolFlags.Function) return 'function'
  if (flags & ts.SymbolFlags.Variable) {
    const declaration = symbol.valueDeclaration ?? symbol.declarations?.[0]
    const type = declaration ? checker.getTypeOfSymbolAtLocation(symbol, declaration) : undefined
    return type && type.getCallSignatures().length > 0 ? 'function' : 'const'
  }
  if (flags & ts.SymbolFlags.Interface) return 'interface'
  if (flags & ts.SymbolFlags.TypeAlias) return 'type'
  if (flags & ts.SymbolFlags.Namespace) return 'namespace'
  return 'other'
}

const typesSection = (file: string): string[] => {
  const program = ts.createProgram([file], { noEmit: true, skipLibCheck: true, strict: true })
  const checker = program.getTypeChecker()
  const source = program.getSourceFile(file)
  if (!source) throw new Error(`cannot read ${file}`)
  const moduleSymbol = checker.getSymbolAtLocation(source)
  if (!moduleSymbol) return []
  return checker
    .getExportsOfModule(moduleSymbol)
    .map((symbol) => {
      const target = symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol
      return `${kindOf(target, checker)} ${symbol.getName()}`
    })
    // By name, in code-point order: the same on every machine and locale.
    .sort((a, b) => byText(a.split(' ')[1], b.split(' ')[1]) || byText(a, b))
}

const cssSection = (file: string): string[] => {
  const css = readFileSync(file, 'utf8')
  const names = new Set<string>()
  for (const match of css.matchAll(/(?:^|[;{\s])(--[A-Za-z0-9_-]+)\s*:/g)) names.add(match[1])
  return [...names].sort().map((name) => `property ${name}`)
}

const lines: string[] = [
  `# ${pkg.name}: what each entry point exports.`,
  '# Generated from the built package by scripts/api-report.ts; update with `npm run api:update`.',
]
for (const [subpath, target] of Object.entries(pkg.exports)) {
  const specifier = subpath === '.' ? pkg.name : `${pkg.name}/${subpath.slice(2)}`
  lines.push('', `## ${specifier}`)
  if (subpath.endsWith('*')) {
    const dir = join(ROOT, (typeof target === 'string' ? target : target.default ?? '').replace(/\*$/, ''))
    lines.push(...readdirSync(dir).sort().map((name) => `file ${name}`))
    continue
  }
  const file = typeof target === 'string' ? target : target.types
  if (!file) throw new Error(`exports["${subpath}"] has no types or file`)
  const path = join(ROOT, file)
  if (!existsSync(path)) throw new Error(`${file} is missing: run \`npm run build\` first`)
  lines.push(...(file.endsWith('.css') ? cssSection(path) : typesSection(path)))
}
const report = `${lines.join('\n')}\n`

if (process.argv.includes('--update')) {
  mkdirSync(dirname(REPORT), { recursive: true })
  writeFileSync(REPORT, report)
  console.log(`✓ api-report: wrote ${REPORT.slice(ROOT.length + 1)}`)
} else {
  const committed = existsSync(REPORT) ? readFileSync(REPORT, 'utf8').replace(/\r\n/g, '\n') : ''
  if (committed !== report) {
    // Each line with its entry point: the same name can be under two.
    const qualified = (text: string) => {
      let section = ''
      const out = new Set<string>()
      for (const line of text.split('\n')) {
        if (line.startsWith('## ')) section = line.slice(3)
        else if (line && !line.startsWith('#')) out.add(`${section}: ${line}`)
      }
      return out
    }
    const before = qualified(committed)
    const after = qualified(report)
    const removed = [...before].filter((line) => !after.has(line))
    const added = [...after].filter((line) => !before.has(line))
    console.error('api/exports.txt does not match the built package. Run `npm run api:update` and commit it.')
    for (const line of removed) console.error(`- ${line}`)
    for (const line of added) console.error(`+ ${line}`)
    process.exit(1)
  }
  console.log('✓ api-report: api/exports.txt matches the built package.')
}
