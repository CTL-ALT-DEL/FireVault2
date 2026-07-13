# FireVault Build 0.87.8

Account Directory performance and iPad responsive-layout release.

- Removes the slow 430 ms animated card correction that fought iPhone momentum scrolling
- Lets touch momentum finish before making one small card-boundary correction
- Avoids writing Account Directory view state during every scroll frame
- Uses a faster nearest-card lookup instead of measuring every visible account card
- Reduces moving card shadows and fixed blur effects while the Account Directory scrolls
- Keeps card locking functional in both scrolling directions
- Adds responsive iPad portrait, landscape, and Split View sizing
- Keeps Account Directory and Account Detail content centered at readable tablet widths
- Expands Account Detail tabs across the available iPad width
- Improves tablet spacing, typography, action targets, information grids, and photo grids
- Allows installed FireVault to rotate on iPad by changing the manifest orientation to `any`
- Preserves account data, Demo Mode, Settings, navigation, and the FireVault storage key
