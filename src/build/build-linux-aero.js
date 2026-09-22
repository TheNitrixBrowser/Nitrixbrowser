'use strict'
const { execFileSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')
function buildLinuxAero() {
  if (process.platform !== 'linux') throw new Error('Build the Linux Aero helper on Linux.')
  const output = path.join(__dirname, 'nitrix-aero')
  execFileSync('cc', ['-std=c99', '-D_DEFAULT_SOURCE', '-O2', '-Wall', '-Wextra', '-Werror', '-fstack-protector-strong',
    '-D_FORTIFY_SOURCE=2', '-fPIE', '-pie', '-Wl,-z,relro,-z,now',
    path.join(__dirname, 'linux-aero.c'), '-o', output, '-lX11'], { stdio: 'inherit' })
  fs.chmodSync(output, 0o755)
  return output
}
if (require.main === module && process.platform === 'linux') buildLinuxAero()
module.exports = buildLinuxAero
