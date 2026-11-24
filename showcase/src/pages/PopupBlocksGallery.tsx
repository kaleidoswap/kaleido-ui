import { useState } from 'react'
import {
  AlertBanner,
  AmountUnitToggle,
  AssetCard,
  Button,
  CheckboxRow,
  QrCode,
  SegmentedTabs,
  Spinner,
  Textarea,
} from 'kaleido-ui'
import { Demo, Grid } from './blocks'

// Building blocks a wallet popup reaches for: busy states, long text and
// opt-ins, banners that ask for an action, and the amount unit switch.

export function PopupBlocksGallery() {
  const [busy, setBusy] = useState(false)
  const [logs, setLogs] = useState(true)
  const [bannerOpen, setBannerOpen] = useState(true)
  const [unit, setUnit] = useState('sats')
  const [fiat, setFiat] = useState('USD')
  const [venue, setVenue] = useState('all')

  return (
    <Grid>
      <Demo title="Spinner" use="The one busy glyph. Label it when it is the only sign of loading; inside a busy control it stays decorative.">
        <div className="flex items-center gap-4">
          <Spinner size="sm" />
          <Spinner />
          <Spinner size="xl" tone="brand" label="Loading" />
          <Spinner size="4xl" tone="secondary" label="Loading" />
        </div>
      </Demo>
      <Demo title="Button loading" use="A submit in flight: the spinner leads the label and the button cannot be pressed twice.">
        <Button
          loading={busy}
          onClick={() => {
            setBusy(true)
            setTimeout(() => setBusy(false), 1500)
          }}
        >
          {busy ? 'Sending' : 'Send'}
        </Button>
      </Demo>
      <Demo title="Textarea" use="Free text longer than a line: feedback, a note, a pasted connection string.">
        <Textarea placeholder="What went wrong?" className="max-w-sm" />
      </Demo>
      <Demo title="CheckboxRow" use="An opt-in that takes effect on submit, not at once (that is a SwitchRow).">
        <div className="max-w-sm">
          <CheckboxRow
            label="Include diagnostic logs"
            description="Recent errors only; never keys or balances."
            checked={logs}
            onCheckedChange={setLogs}
          />
        </div>
      </Demo>
      <Demo title="AlertBanner with an action" use="A notice the user can act on or put away.">
        <div className="max-w-sm">
          {bannerOpen ? (
            <AlertBanner
              variant="warning"
              action={<Button size="xs" variant="surface">Retry</Button>}
              onDismiss={() => setBannerOpen(false)}
            >
              Two accounts could not be reached.
            </AlertBanner>
          ) : (
            <Button size="sm" variant="ghost" onClick={() => setBannerOpen(true)}>
              Show again
            </Button>
          )}
        </div>
      </Demo>
      <Demo title="AssetCard loading" use="A balance being fetched again: the row keeps its height and a spinner stands in for the amount.">
        <div className="max-w-sm">
          <AssetCard ticker="USDT" name="Tether" displayBalance="1,204.50" networks={['RGB20']} loading />
        </div>
      </Demo>
      <Demo title="QrCode fluid" use="A code that shrinks with a narrow popup and stops growing at maxSize.">
        <div className="w-48 rounded-2xl bg-white p-3">
          <QrCode value="bitcoin:bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq" size="fluid" maxSize={232} />
        </div>
      </Demo>
      <Demo title="SegmentedTabs with descriptions" use="Choices that need a word of context under their name.">
        <SegmentedTabs
          aria-label="Swap venue"
          value={venue}
          onValueChange={setVenue}
          options={[
            { value: 'all', label: 'All' },
            { value: 'kaleidoswap', label: 'KaleidoSwap', description: 'RGB Lightning' },
            { value: 'flashnet', label: 'Flashnet', description: 'Spark AMM' },
          ]}
          className="max-w-md"
        />
      </Demo>
      <Demo title="AmountUnitToggle" use="Beside an amount field: sats and the currency the user thinks in, the rest one tap away.">
        <AmountUnitToggle
          baseUnit="sats"
          altUnit={fiat}
          value={unit}
          onChange={(next) => {
            if (next !== 'sats') setFiat(next)
            setUnit(next)
          }}
          choices={[
            { id: 'USD', symbol: '$' },
            { id: 'EUR', symbol: '€' },
            { id: 'CHF', symbol: 'Fr' },
          ]}
        />
      </Demo>
    </Grid>
  )
}
