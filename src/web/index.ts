/**
 * KaleidoSwap UI — Web Components
 *
 * Tailwind CSS + Radix UI based components for web applications.
 *
 * Usage:
 *   import { Button, Card, StatusBadge } from '@kaleidorg/kaleido-ui'
 */

// Utilities
export { cn } from './utils/cn'

// Primitives
export { Button, buttonVariants, type ButtonProps } from './primitives/button'
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from './primitives/card'
export { Input, type InputProps } from './primitives/input'
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './primitives/dialog'
export { Tabs, TabsList, TabsTrigger, TabsContent } from './primitives/tabs'
export { Label } from './primitives/label'
export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
} from './primitives/toast'
export { Toaster } from './primitives/toaster'
export { Icon, Icons, type IconProps } from './primitives/icon'

// Shared Components
export { StatusBadge, type StatusType } from './components/status-badge'
export { NetworkBadge, type NetworkType } from './components/network-badge'
export { AssetIcon } from './components/asset-icon'
export { AssetCard, type AssetCardProps } from './components/asset-card'
export { TransactionCard, type TransactionCardProps } from './components/transaction-card'
export { PageHeader, type PageHeaderProps } from './components/page-header'
export { SettingItem } from './components/setting-item'
export { SectionLabel } from './components/section-label'
export { AlertBanner } from './components/alert-banner'
export { ErrorBoundary } from './components/error-boundary'

// Hooks
export { useToast, toast } from './hooks/use-toast'
export { useAssetIcon, getAssetIconUrl, getFallbackAssetIconUrl } from './hooks/use-asset-icon'
