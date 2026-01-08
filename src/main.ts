import * as core from '@actions/core'
import { findMinecraftVersion } from './version.js'

export async function run(): Promise<void> {
  try {
    const version: string = core.getInput('version', {
      required: true
    })

    const result = await findMinecraftVersion({ version })

    if (result) {
      core.setOutput('version', result)
    } else {
      core.setFailed('No matching Minecraft version found')
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
