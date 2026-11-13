import { useState, type ReactNode } from 'react'
import {
  AccountMenu,
  AccountMenuItem,
  AccountMenuSeparator,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Copyable,
  Icon,
  ReadStatus,
  cn,
} from '@kaleido-ui/index'

// The actions at the top of a page: who is signed in, and how fresh the figures are with the refresh that updates them. On sample data.

function Demo({ title, use, children, className }: { title: string; use: string; children: ReactNode; className?: string }) {
  return (
    <Card variant="secondary" className={cn('min-w-0', className)}>
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-subhead">{title}</CardTitle>
        <CardDescription className="text-caption">{use}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto p-4">{children}</CardContent>
    </Card>
  )
}

export function ActionsGallery() {
  const [read, setRead] = useState({ at: Date.now() - 60_000, fetching: false, failed: false })

  const refetch = () => {
    setRead((r) => ({ ...r, fetching: true }))
    window.setTimeout(() => setRead((r) => ({ at: r.failed ? r.at : Date.now(), fetching: false, failed: r.failed })), 900)
  }

  return (
    <div className="space-y-4">
      <Demo title="AccountMenu" use="Who is signed in, at the end of the top bar. A disclosure: it holds an id with its copy button.">
        <div className="flex justify-start">
          <AccountMenu
            align="start"
            name="alex@example.com"
            secondary="Example Co"
            label="Account: alex@example.com, Owner, Example Co"
            header={
              <div className="min-w-0 space-y-1">
                <div className="truncate text-caption font-medium">alex@example.com</div>
                <div className="text-mini text-muted-foreground">
                  Role: <span className="font-medium text-foreground">Owner</span>
                </div>
                <Copyable value="org_01J8Z3N4Q5R6S7T8V9W0XYZABC" label="organization id" wrap />
              </div>
            }
          >
            <AccountMenuItem icon={<Icon name="settings" className="text-icon-md" />}>Settings</AccountMenuItem>
            <AccountMenuSeparator />
            <AccountMenuItem destructive icon={<Icon name="arrow_back" className="text-icon-md" />}>
              Log out
            </AccountMenuItem>
          </AccountMenu>
        </div>
      </Demo>

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
