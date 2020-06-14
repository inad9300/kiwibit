import { spawn, spawnSync } from 'child_process'

function sleep(time: number) {
  return new Promise(resolve => setTimeout(resolve, time))
}

(async () => {
  console.info('\n➜ Building image from Dockerfile (verify with \`docker images\`)')
  spawnSync('docker', ['build', '--tag', 'kiwibiti', 'database'], { stdio: 'inherit' })

  console.info('\n➜ Stopping and removing previous container')
  spawnSync('docker', ['container', 'stop', 'kiwibitc'], { stdio: 'inherit' })
  spawnSync('docker', ['rm', 'kiwibitc'], { stdio: 'inherit' })

  console.info('\n➜ Running container (verify with \`docker ps\`; check logs with \`docker logs -f kiwibitc\`; interact with \`docker exec -it kiwibitc psql -U postgres\`)')
  spawnSync('docker', ['run', '--name', 'kiwibitc', '--env', 'POSTGRES_PASSWORD=hnzygqa2QLrRLxH4MvsOtcVVUWsYvQ7E', '-p', '5000:5432', '--detach', 'kiwibiti'], { stdio: 'inherit' })

  const since = new Date().toISOString()
  do {
    await sleep(1_000)
  } while (
    !spawnSync('docker', ['logs', '--since', since, 'kiwibitc'], { stdio: 'pipe' })
      .stdout
      .toString()
      .includes('PostgreSQL init process complete; ready for start up.')
  )

  console.info('\n➜ Installing root-level dependencies')
  spawnSync('npm', ['i'], { stdio: 'inherit' })

  process.chdir('./client')

  console.info('\n➜ Installing client dependencies')
  spawnSync('npm', ['i'], { stdio: 'inherit' })

  console.info('\n➜ Starting client')
  spawn('npm', ['start'], { stdio: 'inherit' })

  process.chdir('../server')

  console.info('\n➜ Installing server dependencies')
  spawnSync('npm', ['i'], { stdio: 'inherit' })

  console.info('\n➜ Starting server')
  spawn('npm', ['start'], { stdio: 'inherit' })
})()
