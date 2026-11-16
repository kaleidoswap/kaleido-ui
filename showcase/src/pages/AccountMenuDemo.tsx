import {
  AccountMenu,
  AccountMenuItem,
  AccountMenuSeparator,
  Icon,
  Tag,
} from '@kaleido-ui/index'

/** Who is signed in, at the end of the top bar. */
export function AccountMenuDemo() {
  return (
    <div className="flex justify-start">
      <AccountMenu
        align="start"
        name="John Doe"
        label="Account: John Doe, Owner, Example Co"
        badge={<Tag tone="violet">Owner</Tag>}
        header={
          <div className="min-w-0 space-y-0.5">
            <div className="truncate text-subhead font-semibold leading-tight text-foreground">John Doe</div>
            <div className="truncate text-body text-muted-foreground">Example Co</div>
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
  )
}
