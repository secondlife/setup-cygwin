import * as cache from '@actions/cache'
import * as core from '@actions/core'
import * as crypto from 'crypto'
import * as exec from '@actions/exec'
import * as path from 'path'
import * as tc from '@actions/tool-cache'
import {warnOnError} from './util'

const CYGWIN_SETUP = 'setup-x86_64.exe'
const TOOL_NAME = 'cygwin-setup'
const LATEST_VERSION = '3.4'
const CYGWIN_URL = 'https://cygwin.com/setup-x86_64.exe'

async function downloadCygwin(): Promise<string> {
  core.debug(`Downloading ${CYGWIN_URL}`)
  const setup = await tc.downloadTool(CYGWIN_URL)
  const setupPath = await tc.cacheFile(
    setup,
    CYGWIN_SETUP,
    TOOL_NAME,
    LATEST_VERSION
  )
  return path.join(setupPath, CYGWIN_SETUP)
}

async function getCygwin(): Promise<string> {
  const cachedPath = tc.find(TOOL_NAME, LATEST_VERSION)
  if (cachedPath) {
    return path.join(cachedPath, CYGWIN_SETUP)
  }
  return downloadCygwin()
}

async function installCygwin(
  packages: string[],
  site: string,
  local: string,
  root: string
): Promise<void> {
  const cachePaths = [root]

  const packagesCsv = packages.join(',')

  const d = new Date()
  const year = d.getUTCFullYear()
  const month = d.getUTCMonth()
  const cacheHash = crypto
    .createHash('sha256')
    .update(packagesCsv)
    .update(site)
    .digest('hex')
  // Bust cache every month to ensure updated packages are stored
  const cacheKey = `cygwin-root-${year}-${month}-${cacheHash}`

  // Attempt to restore cache but do not block the build if an exception
  // occurs. @actions/cache has proven unreliable in the past ex.
  // https://github.com/actions/cache/issues/698
  const cacheHit = await warnOnError<string | undefined>(async () => {
    return cache.restoreCache(cachePaths, cacheKey)
  })

  if (cacheHit === cacheKey) {
    console.log(`♻️ Re-using previously cached cygwin...`)
    return
  }

  console.log(`⬇️ Installing cygwin at ${root}...`)
  const setup = await getCygwin()

  await exec.exec(setup, [
    '-q',
    '-P',
    packagesCsv,
    '-s',
    site,
    '-l',
    local,
    '-R',
    root
  ])

  await warnOnError(async () => {
    await cache.saveCache(cachePaths, cacheKey)
  })
}

async function run(): Promise<void> {
  try {
    core.startGroup('Setup Cygwin')
    const site = core.getInput('site')
    const local = core.getInput('local-packages')
    const root = core.getInput('root')
    const packages = core
      .getInput('packages')
      .split(/\n|\s/)
      .filter(x => x !== '')
    await installCygwin(packages, site, local, root)
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    } else {
      throw error
    }
  } finally {
    core.endGroup()
  }
}

run()
