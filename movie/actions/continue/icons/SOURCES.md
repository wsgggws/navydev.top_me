# 图标来源

这些是本机已安装应用的静态图形副本，不包含用户文件、账号或配置。Dock PNG 从对应应用的 `Contents/Resources/*.icns` 转为 128px；Finder 取自系统 Finder.app。菜单栏使用原始资源的透明度蒙版，颜色跟随布景菜单栏。

| 菜单栏图形 | 本机安装包与资源 |
| --- | --- |
| Alfred | Alfred 5.app / Resources/statusicon.tiff |
| Rime（鼠须管） | Squirrel.app / Resources/rime.pdf |
| Karabiner-Elements | Karabiner-Console-User-Server.app / Assets.car / menu |
| KeyboardHolder | KeyboardHolder.app / Assets.car / statusIcon2 |
| Bob | Bob.app / Assets.car / logo_status_bob |
| CC Switch | CC Switch.app / MacOS/cc-switch 中内嵌的 72×72 透明 PNG（白色放射图形） |
| KeepingYouAwake | KeepingYouAwake.app / Assets.car / ActiveIcon |

Longshot 的 Dock 图形来自 Longshot.app/AppIcon.icns；其余新增 Dock 图形分别来自 Rectangle.app/AppIcon.icns、LaunchNext.app/AppIcon.icns、KeyCastr.app/KeyCastr.icns、Omi录屏专家.app/AppIcon.icns。

## 核对范围

已确认这些图形来自本机实际安装版本的原始资源，未用手绘近似替代。系统界面读取未能获得当前状态栏截图，因此未能逐一视觉核对当前显示的状态或自定义样式。Bob 使用默认图案，KeepingYouAwake 使用启用状态；CC Switch 使用本机二进制内嵌图形，其运行时状态可能切换图案。Bob 当前偏好文件因 macOS 权限限制不可读取。若以后更换状态图形，只需替换对应 PNG，不必改动画。

图标及商标归各应用原权利人所有。
