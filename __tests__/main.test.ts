/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * To mock dependencies in ESM, you can create fixtures that export mock
 * functions and objects. For example, the core module is mocked in this test,
 * so that the actual '@actions/core' module is not imported.
 */
import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js'
import { findMinecraftVersion } from '../__fixtures__/version.js'

// Mocks should be declared before the module being tested is imported.
jest.unstable_mockModule('@actions/core', () => core)
jest.unstable_mockModule('../src/version.js', () => ({ findMinecraftVersion }))

// The module being tested should be imported dynamically. This ensures that the
// mocks are used in place of any actual dependencies.
const { run } = await import('../src/main.js')

describe('main.ts', () => {
  beforeEach(() => {
    // Set the action's inputs as return values from core.getInput().
    core.getInput.mockImplementation((name: string) => {
      const inputs: Record<string, string> = {
        version: '21.11.*'
      }
      return inputs[name] || ''
    })

    // Mock findMinecraftVersion to return a version.
    findMinecraftVersion.mockImplementation(() => Promise.resolve('21.11.1'))
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Sets the version output when a version is found', async () => {
    await run()

    // Verify findMinecraftVersion was called with correct parameters.
    expect(findMinecraftVersion).toHaveBeenCalledWith({
      version: '21.11.*'
    })

    // Verify the version output was set.
    expect(core.setOutput).toHaveBeenCalledWith('version', '21.11.1')
  })

  it('Sets a failed status when no version is found', async () => {
    // Mock findMinecraftVersion to return undefined.
    findMinecraftVersion.mockClear().mockResolvedValueOnce(undefined)

    await run()

    // Verify that the action was marked as failed.
    expect(core.setFailed).toHaveBeenCalledWith(
      'No matching Minecraft version found'
    )
  })

  it('Sets a failed status when an error occurs', async () => {
    // Mock findMinecraftVersion to throw an error.
    findMinecraftVersion
      .mockClear()
      .mockRejectedValueOnce(new Error('Minecraft API request failed: 500'))

    await run()

    // Verify that the action was marked as failed.
    expect(core.setFailed).toHaveBeenCalledWith(
      'Minecraft API request failed: 500'
    )
  })
})
