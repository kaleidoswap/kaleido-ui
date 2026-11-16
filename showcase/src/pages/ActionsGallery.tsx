import { useState } from 'react'
import {
  ReadStatus,
} from '@kaleido-ui/index'
import { Demo } from './blocks'

// The actions at the top of a page: how fresh the figures are with the refresh that updates them. On sample data.


export function ActionsGallery() {
  const [read, setRead] = useState({ at: Date.now() - 60_000, fetching: false, failed: false })

  const refetch = () => {
    setRead((r) => ({ ...r, fetching: true }))
    window.setTimeout(() => setRead((r) => ({ at: r.failed ? r.at : Date.now(), fetching: false, failed: r.failed })), 900)
  }

  return (
    <div className="space-y-16">
      <Demo title="ReadStatus" use="How old the figures are, beside the page's one Refresh. Turn on a failing refresh to see the stale state.">
        <div className="space-y-3">
          <ReadStatus
            reads={[{ data: {}, dataUpdatedAt: read.at, isError: read.failed, isFetching: read.fetching, refetch }]}
            formatTime={(ms) => new Date(ms).toLocaleTimeString()}
          />
          <label className="flex items-center gap-2 text-caption text-muted-foreground">
            <input type="checkbox" checked={read.failed} onChange={(event) => setRead((r) => ({ ...r, failed: event.target.checked }))} />
            The next refresh fails
          </label>
        </div>
      </Demo>
    </div>
  )
}
