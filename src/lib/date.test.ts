import { afterEach, describe, expect, it, vi } from 'vitest'
import { getToday } from '@/lib/date'

afterEach(() => {
  vi.useRealTimers()
})

describe('getToday', () => {
  it.each([
    [new Date(2026, 0, 5, 12), '2026-01-05'],
    [new Date(2026, 10, 25, 12), '2026-11-25'],
    [new Date(2024, 1, 29, 12), '2024-02-29'],
    [new Date(2026, 11, 31, 23, 59, 59), '2026-12-31'],
    [new Date(2027, 0, 1, 0, 0, 0), '2027-01-01'],
  ])('formats local date %s as %s', (now, expected) => {
    vi.useFakeTimers()
    vi.setSystemTime(now)
    expect(getToday()).toBe(expected)
  })

  it('reads the clock again after local midnight', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 0, 31, 23, 59, 59))
    expect(getToday()).toBe('2026-01-31')
    vi.setSystemTime(new Date(2026, 1, 1, 0, 0, 0))
    expect(getToday()).toBe('2026-02-01')
  })
})
