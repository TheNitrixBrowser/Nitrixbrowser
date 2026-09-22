const { execFileSync } = require('child_process')
const fs = require('fs')
const os = require('os')
const path = require('path')

const projectDir = path.resolve(__dirname, '..')
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nitrix-wine-launcher-'))
const outputPath = path.join(__dirname, 'wine-launcher.exe')
const packageData = JSON.parse(fs.readFileSync(path.join(projectDir, 'package.json'), 'utf8'))
const versionParts = String(packageData.version || '0.0.0').split('.').map(value => Number.parseInt(value, 10) || 0)
while (versionParts.length < 4) versionParts.push(0)
const version = versionParts.slice(0, 4).join(',')
const versionText = versionParts.slice(0, 3).join('.')

try {
  const kernelLibrary = path.join(tempDir, 'kernel32.lib')
  const userLibrary = path.join(tempDir, 'user32.lib')
  const objectPath = path.join(tempDir, 'wine-launcher.obj')
  const resourceScript = path.join(tempDir, 'wine-launcher.rc')
  const resourcePath = path.join(tempDir, 'wine-launcher.res')

  execFileSync('llvm-dlltool', ['-m', 'i386:x86-64', '-d', path.join(__dirname, 'wine-launcher-kernel32.def'), '-l', kernelLibrary])
  execFileSync('llvm-dlltool', ['-m', 'i386:x86-64', '-d', path.join(__dirname, 'wine-launcher-user32.def'), '-l', userLibrary])
  execFileSync('clang', [
    '--target=x86_64-pc-windows-msvc',
    '-ffreestanding',
    '-fno-stack-protector',
    '-fno-builtin',
    '-nostdlib',
    '-c', path.join(__dirname, 'wine-launcher.c'),
    '-o', objectPath,
  ])

  const iconPath = path.join(projectDir, 'icon.ico').replace(/\\/g, '\\\\')
  fs.writeFileSync(resourceScript, `1 ICON "${iconPath}"\n1 VERSIONINFO\nFILEVERSION ${version}\nPRODUCTVERSION ${version}\nFILEOS 0x40004\nFILETYPE 0x1\nBEGIN\n  BLOCK "StringFileInfo"\n  BEGIN\n    BLOCK "040904B0"\n    BEGIN\n      VALUE "FileDescription", "Nitrix Browser"\n      VALUE "FileVersion", "${versionText}"\n      VALUE "InternalName", "Nitrix"\n      VALUE "OriginalFilename", "Nitrix.exe"\n      VALUE "ProductName", "Nitrix"\n      VALUE "ProductVersion", "${versionText}"\n    END\n  END\n  BLOCK "VarFileInfo"\n  BEGIN\n    VALUE "Translation", 0x0409, 1200\n  END\nEND\n`)
  execFileSync('llvm-rc', ['/fo', resourcePath, resourceScript])
  execFileSync('lld-link', [
    '/subsystem:windows',
    '/entry:wWinMainCRTStartup',
    `/out:${outputPath}`,
    objectPath,
    resourcePath,
    kernelLibrary,
    userLibrary,
  ])
  console.log(`Zbudowano launcher Wine: ${path.relative(projectDir, outputPath)}`)
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true })
}
