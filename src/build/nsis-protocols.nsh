!macro registerNitrixBrowser
  WriteRegStr HKCU "Software\RegisteredApplications" "Nitrix" "Software\Clients\StartMenuInternet\Nitrix\Capabilities"

  WriteRegStr HKCU "Software\Clients\StartMenuInternet\Nitrix" "" "Nitrix"
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\Nitrix\DefaultIcon" "" "$INSTDIR\Nitrix.exe,0"
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\Nitrix\shell\open\command" "" '"$INSTDIR\Nitrix.exe"'

  WriteRegStr HKCU "Software\Clients\StartMenuInternet\Nitrix\Capabilities" "ApplicationName" "Nitrix"
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\Nitrix\Capabilities" "ApplicationDescription" "Nitrix Browser"
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\Nitrix\Capabilities" "ApplicationIcon" "$INSTDIR\Nitrix.exe,0"
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\Nitrix\Capabilities\Startmenu" "StartMenuInternet" "Nitrix"
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\Nitrix\Capabilities\URLAssociations" "http" "http"
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\Nitrix\Capabilities\URLAssociations" "https" "https"
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\Nitrix\Capabilities\FileAssociations" ".htm" "NitrixHTML"
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\Nitrix\Capabilities\FileAssociations" ".html" "NitrixHTML"
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\Nitrix\Capabilities\FileAssociations" ".shtml" "NitrixHTML"
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\Nitrix\Capabilities\FileAssociations" ".xht" "NitrixHTML"
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\Nitrix\Capabilities\FileAssociations" ".xhtml" "NitrixHTML"
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\Nitrix\Capabilities\FileAssociations" ".webp" "NitrixHTML"

  WriteRegStr HKCU "Software\Clients\StartMenuInternet\Nitrix\InstallInfo" "ReinstallCommand" '"$INSTDIR\Nitrix.exe" --make-default-browser'
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\Nitrix\InstallInfo" "HideIconsCommand" '"$INSTDIR\Nitrix.exe"'
  WriteRegStr HKCU "Software\Clients\StartMenuInternet\Nitrix\InstallInfo" "ShowIconsCommand" '"$INSTDIR\Nitrix.exe"'
  WriteRegDWORD HKCU "Software\Clients\StartMenuInternet\Nitrix\InstallInfo" "IconsVisible" 1

  WriteRegStr HKCU "Software\Classes\NitrixURL" "" "Nitrix URL"
  WriteRegStr HKCU "Software\Classes\NitrixURL" "URL Protocol" ""
  WriteRegStr HKCU "Software\Classes\NitrixURL\DefaultIcon" "" "$INSTDIR\Nitrix.exe,0"
  WriteRegStr HKCU "Software\Classes\NitrixURL\shell\open\command" "" '"$INSTDIR\Nitrix.exe" "%1"'

  WriteRegStr HKCU "Software\Classes\http" "" "URL:http"
  WriteRegStr HKCU "Software\Classes\http" "URL Protocol" ""
  WriteRegStr HKCU "Software\Classes\http\DefaultIcon" "" "$INSTDIR\Nitrix.exe,0"
  WriteRegStr HKCU "Software\Classes\http\shell\open\command" "" '"$INSTDIR\Nitrix.exe" "%1"'
  WriteRegStr HKCU "Software\Classes\https" "" "URL:https"
  WriteRegStr HKCU "Software\Classes\https" "URL Protocol" ""
  WriteRegStr HKCU "Software\Classes\https\DefaultIcon" "" "$INSTDIR\Nitrix.exe,0"
  WriteRegStr HKCU "Software\Classes\https\shell\open\command" "" '"$INSTDIR\Nitrix.exe" "%1"'

  WriteRegStr HKCU "Software\Classes\NitrixHTML" "" "Nitrix HTML Document"
  WriteRegStr HKCU "Software\Classes\NitrixHTML\DefaultIcon" "" "$INSTDIR\Nitrix.exe,0"
  WriteRegStr HKCU "Software\Classes\NitrixHTML\shell\open\command" "" '"$INSTDIR\Nitrix.exe" "%1"'

  WriteRegStr HKCU "Software\Classes\Applications\Nitrix.exe" "ApplicationName" "Nitrix"
  WriteRegStr HKCU "Software\Classes\Applications\Nitrix.exe" "ApplicationDescription" "Nitrix Browser"
  WriteRegStr HKCU "Software\Classes\Applications\Nitrix.exe" "ApplicationIcon" "$INSTDIR\Nitrix.exe,0"
  WriteRegStr HKCU "Software\Classes\Applications\Nitrix.exe\shell\open\command" "" '"$INSTDIR\Nitrix.exe" "%1"'
  WriteRegStr HKCU "Software\Classes\Applications\Nitrix.exe\SupportedTypes" ".htm" ""
  WriteRegStr HKCU "Software\Classes\Applications\Nitrix.exe\SupportedTypes" ".html" ""
  WriteRegStr HKCU "Software\Classes\Applications\Nitrix.exe\SupportedTypes" ".shtml" ""
  WriteRegStr HKCU "Software\Classes\Applications\Nitrix.exe\SupportedTypes" ".xht" ""
  WriteRegStr HKCU "Software\Classes\Applications\Nitrix.exe\SupportedTypes" ".xhtml" ""
  WriteRegStr HKCU "Software\Classes\Applications\Nitrix.exe\SupportedTypes" ".webp" ""

  System::Call 'shell32::SHChangeNotify(i 0x08000000, i 0x00001003, p 0, p 0)'
  Sleep 1000
!macroend

!macro unregisterNitrixBrowser
  DeleteRegValue HKCU "Software\RegisteredApplications" "Nitrix"
  DeleteRegKey HKCU "Software\Clients\StartMenuInternet\Nitrix"
  DeleteRegKey HKCU "Software\Classes\NitrixURL"
  DeleteRegKey HKCU "Software\Classes\NitrixHTML"
  DeleteRegKey HKCU "Software\Classes\Applications\Nitrix.exe"
!macroend

!macro customInstall
  !insertmacro registerNitrixBrowser
!macroend

!macro customUnInstall
  !insertmacro unregisterNitrixBrowser
!macroend
