import { jest } from '@jest/globals'

export const findMinecraftVersion =
  jest.fn<typeof import('../src/version.js').findMinecraftVersion>()
