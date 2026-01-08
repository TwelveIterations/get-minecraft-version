/**
 * Unit tests for src/version.ts
 */
import { jest } from '@jest/globals'
import { findMinecraftVersion } from '../src/version.js'

// Mock node-fetch
const mockFetch = jest.fn()
jest.unstable_mockModule('node-fetch', () => ({
  default: mockFetch
}))

describe('version.ts', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('Throws when version is missing', async () => {
    await expect(
      findMinecraftVersion({
        version: ''
      })
    ).rejects.toThrow('version is not a string')
  })
})
