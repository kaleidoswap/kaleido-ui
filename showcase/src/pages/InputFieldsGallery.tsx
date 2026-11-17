import { useState } from 'react'
import {
  Choice,
  ChoiceGroup,
  ListField,
} from 'kaleido-ui'
import { Demo, Grid } from './blocks'

// Inputs that take more than one value: a list entered as a list, and a short
// set of exclusive options, on sample data.

const checkOrigin = (item: string) =>
  /^https:\/\/[^/\s]+$/.test(item) ? null : 'An origin is https:// and a host, with no path or trailing slash.'

export function InputFieldsGallery() {
  const [origins, setOrigins] = useState<readonly string[]>(['https://app.example.com'])
  const [scope, setScope] = useState<'view' | 'all'>('view')
  const [format, setFormat] = useState<'csv' | 'pdf'>('csv')

  return (
    <Grid>
      <Demo title="ListField" use="A list entered as a list: each item checked as it is added, the accepted ones shown as what will be sent.">
        <ListField
          label="Allowed origins"
          requirement="Required"
          noun="origin"
          items={origins}
          onChange={setOrigins}
          check={checkOrigin}
          form="An origin is a scheme and a host."
          example="https://app.example.com"
        />
      </Demo>

      <Demo title="ChoiceGroup" use="A few exclusive options in a form or dialog, each with one line saying what it means.">
        <div className="flex flex-col gap-3.5">
          <ChoiceGroup legend="What to export">
            <Choice checked={scope === 'view'} onChange={() => setScope('view')} title="What this view holds" detail="With the filters in force, in the order shown." />
            <Choice checked={scope === 'all'} onChange={() => setScope('all')} title="The whole dataset" detail="As if the filters were cleared." />
          </ChoiceGroup>
          <ChoiceGroup legend="Format">
            <Choice checked={format === 'csv'} onChange={() => setFormat('csv')} title="CSV" detail="For a spreadsheet; integers as read." />
            <Choice checked={format === 'pdf'} onChange={() => setFormat('pdf')} title="PDF" detail="To read or share; landscape pages." />
          </ChoiceGroup>
        </div>
      </Demo>
    </Grid>
  )
}
