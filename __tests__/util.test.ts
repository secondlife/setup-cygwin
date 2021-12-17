import {expect, test} from '@jest/globals'
import {warnOnError} from '../src/util'
import * as core from '@actions/core'

jest.mock('@actions/core')

test('warnOnError', async () => {
  await warnOnError(async () => {
    throw Error('Exception')
  })
  expect(core.warning).toBeCalledWith('Exception')
})
