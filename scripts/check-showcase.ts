/**
 * Showcase drift lint.
 *
 * The showcase is where the design is decided, and consumers copy what it
 * shows. When a gallery page defined its own component to fill a library one
 * (the metrics gallery's `Figure`, `Delta`, `NoPriorData` and `PeriodInfo`
 * inside every `MetricCard`), that piece was never published: platform-panel
 * copied each one by hand, and every change to the gallery had to be copied
 * again, one component at a time.
 *
 * So a component the showcase renders belongs in `src/web/` and is imported
 * from the package entry. The showcase may define only:
 *
 * - its demos, named `…Gallery`, `…Demo` or `…Preview(s)`: a sample of the
 *   library with sample data, not a part a consumer would place;
 * - the scaffolding in ALLOWED below, each with the reason it is not a
 *   library part.
 *
 * Anything else fails the build. Move it into `src/web/components/`, export it
 * from `src/web/index.ts` and import it here; or, if it really is showcase
 * scaffolding, add it to ALLOWED with why.
 *
 * Run:  npm run check:showcase   (also wired into pre-build via package.json)
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const SHOWCASE = join(ROOT, 'showcase', 'src')

/** A demo of the library, by name. */
const DEMO_NAME = /(Gallery|Demo|Previews?)$/

/** Showcase scaffolding, by file and name, and why it is not a library part. */
const ALLOWED: Record<string, Record<string, string>> = {
  'App.tsx': {
    App: 'the showcase itself',
    Section: 'a showcase page section with its search anchor',
    Row: 'a labelled row of samples on a showcase page',
    LogoGroup: 'lays out one logo in its variants for the logo pages',
    IconLabel: 'the name under a glyph in the icon grid',
    GitHubMark: "the showcase's link to its repository",
    NavFooterActions: "the showcase's own navigation footer",
  },
  'pages/blocks.tsx': {
    Grid: 'the grid the samples sit in',
    BlockTitle: 'the heading above a group of samples',
  },
  'pages/ChartsGallery.tsx': {
    ChartCard: 'feeds a sample chart its title, timeframes and filters from the gallery state',
    RankedBarList: 'BarList with sample partners',
  },
  'pages/ComponentGalleries.tsx': {
    NetworkFilterDropdown: 'FilterDropdown with a sample network list, shared by two galleries',
    SwapReceipt: 'a receipt assembled from SummaryRows, Copyable and AssetLabel with sample data',
  },
  'pages/ProductPreviews.tsx': {
    ExtensionScreen: 'a mock extension screen',
    ExtensionDashboard: 'a mock extension screen',
    ExtensionSwap: 'a mock extension screen',
    ExtensionActivity: 'a mock extension screen',
    ExtensionSettings: 'a mock extension screen',
    ExtensionPopup: 'a mock extension popup',
    SwapPanel: 'a mock swap form in a product preview',
    WebNavBar: 'a mock web app navigation bar',
    AmountPanel: 'one side of the mock swap form',
    WebHome: 'a mock web app page',
    WebSwaps: 'a mock web app page',
    WebStatus: 'a mock web app page',
    WebApp: 'the mock web app',
    PopupFrame: 'a device frame around a preview',
    BrowserFrame: 'a device frame around a preview',
  },
  'search/SearchBar.tsx': {
    SearchBar: "the showcase's own search",
  },
}

/** A PascalCase function or arrow-function component at the top level. */
const DECLARATION =
  /^(?:export\s+)?(?:function\s+([A-Z][A-Za-z0-9]*)\s*[(<]|const\s+([A-Z][A-Za-z0-9]*)\s*(?::[^=]+)?=\s*(?:\(|function|React\.forwardRef|forwardRef|memo))/gm

const tsxFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return tsxFiles(path)
    return name.endsWith('.tsx') ? [path] : []
  })

const problems: string[] = []
const seenAllowed = new Set<string>()

for (const file of tsxFiles(SHOWCASE)) {
  const key = relative(SHOWCASE, file).split('\\').join('/')
  const text = readFileSync(file, 'utf8')
  for (const match of text.matchAll(DECLARATION)) {
    const name = match[1] ?? match[2]
    if (DEMO_NAME.test(name)) continue
    if (ALLOWED[key]?.[name]) {
      seenAllowed.add(`${key}:${name}`)
      continue
    }
    const line = text.slice(0, match.index).split('\n').length
    problems.push(
      `showcase/src/${key}:${line} defines ${name}. A component the showcase renders ships in the package: ` +
        `move it to src/web/components/, export it from src/web/index.ts and import it from '@kaleido-ui/index'. ` +
        `If it is showcase scaffolding, add it to ALLOWED in scripts/check-showcase.ts with the reason.`,
    )
  }
}

// An entry for a component that is gone would let a new one by that name in unseen.
for (const [file, names] of Object.entries(ALLOWED)) {
  for (const name of Object.keys(names)) {
    if (!seenAllowed.has(`${file}:${name}`)) {
      problems.push(`scripts/check-showcase.ts allows ${file}:${name}, which no longer exists. Remove the entry.`)
    }
  }
}

if (problems.length > 0) {
  console.error(`Showcase drift: ${problems.length} problem(s)\n`)
  for (const problem of problems) console.error(`- ${problem}`)
  process.exit(1)
}
console.log('Showcase check passed: every component it renders is exported by the package, or is listed scaffolding.')
