export interface CursorConfig {
  enabled: boolean
  cursors: Record<string, {
    path: string
    hotspot: string
  }>
}
