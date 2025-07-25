const path = require('./config')
const browserSync = require('browser-sync').create()
const { spawn } = require('child_process')

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'

browserSync.init({
  server: {
    baseDir: './',
  },
  open: true,
})

browserSync.watch(['./*.html', './**/*.html']).on('change', () => {
  browserSync.reload()
})

browserSync.watch(`${path.scss}/**/*.scss`).on('change', () => {
  if (!npmCmd) return
  const stylesProcess = spawn(npmCmd, ['run', 'styles:minified'], {
    shell: true, // <== ESSENCIAL no Windows
    stdio: 'inherit',
  })

  stylesProcess.on('close', (code) => {
    if (code === 0) {
      browserSync.reload('*.css')
    }
  })
})

browserSync.watch(`${path.src_js}/**/*.js`).on('change', () => {
  if (!npmCmd) return
  const scriptsProcess = spawn(npmCmd, ['run', 'scripts:minified'], {
    shell: true, // <== ESSENCIAL no Windows
    stdio: 'inherit',
  })

  scriptsProcess.on('close', () => {
    browserSync.reload()
  })
})
