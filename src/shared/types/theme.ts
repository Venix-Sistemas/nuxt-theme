import type { TypographyConfig } from './typography'
import type { ScrollbarConfig } from './scrollbar'
import type { CursorConfig } from './cursor'
import type { ColorsConfig } from './colors'

export interface ThemeConfig {
  name: string
  typography: TypographyConfig
  customScrollbar: ScrollbarConfig
  customCursor: CursorConfig
  colors: ColorsConfig
}
