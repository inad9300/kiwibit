import { spawn, spawnSync } from 'child_process'

function sleep(time: number) {
  return new Promise(resolve => setTimeout(resolve, time))
}

function isDockerRunning() {
  return spawnSync('docker', ['stats', '--no-stream'], { stdio: 'pipe' }).status === 0
}

function logStep(desc: string) {
  console.info(`\n\x1b[36m➜ ${desc}\x1b[0m`)
}

(async () => {
  process.on('SIGINT', () => {
    clientStart?.kill()
    serverStart?.kill()
    process.exit(0)
  })

  if (!isDockerRunning()) {
    logStep('Starting Docker daemon')
    if (process.platform === 'darwin') {
      spawnSync('open', ['--hide', '--background', '-a', 'Docker'], { stdio: 'inherit' })
    } else if (process.platform === 'linux') {
      // TODO spawnSync('systemctl', ['start', 'docker'], { stdio: 'inherit' })
    }

    do {
      await sleep(1_000)
    } while (!isDockerRunning())
  }

  logStep('Building image from Dockerfile (verify with `docker images`)')
  spawnSync('docker', ['build', '--tag', 'kiwibiti', 'database'], { stdio: 'inherit' })

  logStep('Stopping and removing previous container')
  spawnSync('docker', ['container', 'stop', 'kiwibitc'], { stdio: 'inherit' })
  spawnSync('docker', ['rm', 'kiwibitc'], { stdio: 'inherit' })

  logStep('Running container (verify with `docker ps`; check logs with `docker logs --follow kiwibitc`; interact with `docker exec -it kiwibitc psql -U postgres`)')
  spawnSync('docker', ['run', '--name', 'kiwibitc', '--env', 'POSTGRES_PASSWORD=hnzygqa2QLrRLxH4MvsOtcVVUWsYvQ7E', '--publish', '5000:5432', '--detach', 'kiwibiti'], { stdio: 'inherit' })

  const since = new Date().toISOString()
  do {
    await sleep(1_000)
  } while (
    !spawnSync('docker', ['logs', '--since', since, 'kiwibitc'], { stdio: 'pipe' })
      .stdout
      .toString()
      .includes('PostgreSQL init process complete; ready for start up.')
  )

  logStep('Installing root-level dependencies')
  spawnSync('npm', ['i'], { stdio: 'inherit' })

  process.chdir('./server')

  logStep('Installing server dependencies')
  spawnSync('npm', ['i'], { stdio: 'inherit' })

  logStep('Starting server')
  const serverStart = spawn('npm', ['start'], { stdio: 'inherit' })

  process.chdir('../client')

  logStep('Installing client dependencies')
  spawnSync('npm', ['i'], { stdio: 'inherit' })

  logStep('Starting client')
  const clientStart = spawn('npm', ['start'], { stdio: 'inherit' })
})()
