const fs = require('fs')
const path = require('path')

module.exports = async function afterPack(context) {
  if (context.electronPlatformName === 'linux') {
    const helper = require('./build-linux-aero')()
    const destination = path.join(context.appOutDir, 'resources', 'nitrix-aero')
    fs.copyFileSync(helper, destination)
    fs.chmodSync(destination, 0o755)
    return
  }
  if (context.electronPlatformName !== 'win32') return

  const appDirectory = context.appOutDir
  const electronExecutable = path.join(appDirectory, 'Nitrix.exe')
  const coreExecutable = path.join(appDirectory, 'Nitrix-core.exe')
  const launcherExecutable = path.join(__dirname, 'wine-launcher.exe')

  if (!fs.existsSync(electronExecutable)) throw new Error(`Brak pliku ${electronExecutable}`)
  if (!fs.existsSync(launcherExecutable)) throw new Error('Najpierw zbuduj build/wine-launcher.exe')

  fs.renameSync(electronExecutable, coreExecutable)
  fs.copyFileSync(launcherExecutable, electronExecutable)
}
