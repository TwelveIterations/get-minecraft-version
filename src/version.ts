export async function findMinecraftVersion(options: {
  version: string
}): Promise<string | undefined> {
  const { version: versionSearch } = options
  if (!versionSearch || typeof versionSearch !== 'string') {
    throw new Error('version is not a string')
  }

  const response = await fetch(
    'https://launchermeta.mojang.com/mc/game/version_manifest.json'
  )
  const json = (await response.json()) as {
    latest: { release: string; snapshot: string }
    versions: {
      id: string
      type: string
      url: string
      time: string
      releaseTime: string
    }[]
  }
  if (!response.ok) {
    throw new Error(
      `Minecraft API request failed: ${response.status} ${response.statusText}`
    )
  }

  const versions = json.versions.filter(
    (it) => it.id == versionSearch || it.id.startsWith(versionSearch + '-')
  )
  if (versions.length === 0) {
    return undefined
  }

  return versions[0].id
}
