import { describe, expect, it } from 'vitest'
import type { Application } from '@/types/application'
import { countByMonth, countByStatus, summarize } from '@/lib/stats'

const application = (overrides: Partial<Application> = {}): Application => ({
  id: 'synthetic-id',
  company: 'テスト株式会社',
  appliedAt: '2026-01-15',
  source: '',
  status: 'applied',
  note: '',
  ...overrides,
})

describe('countByMonth', () => {
  it('returns no months for an empty list', () => {
    expect(countByMonth([])).toEqual([])
  })

  it('ignores missing application dates', () => {
    expect(countByMonth([application({ appliedAt: null })])).toEqual([])
    expect(countByMonth([
      application({ appliedAt: null }), application(),
    ])).toEqual([{ month: '2026-01', count: 1 }])
  })

  it('combines dates in the same month and sorts unsorted input', () => {
    expect(countByMonth([
      application({ appliedAt: '2026-02-28', status: 'rejected' }),
      application({ appliedAt: '2026-01-31' }),
      application({ appliedAt: '2026-02-01', status: 'offer' }),
    ])).toEqual([
      { month: '2026-01', count: 1 },
      { month: '2026-02', count: 2 },
    ])
  })

  it('fills missing months across a year boundary without extending the range', () => {
    expect(countByMonth([
      application({ appliedAt: '2026-02-01' }),
      application({ appliedAt: '2025-11-30' }),
    ])).toEqual([
      { month: '2025-11', count: 1 },
      { month: '2025-12', count: 0 },
      { month: '2026-01', count: 0 },
      { month: '2026-02', count: 1 },
    ])
  })

  it('includes leap day in February', () => {
    expect(countByMonth([application({ appliedAt: '2024-02-29' })]))
      .toEqual([{ month: '2024-02', count: 1 }])
  })
})

describe('countByStatus', () => {
  it('retains all seven statuses with zero counts for empty input', () => {
    expect(countByStatus([])).toEqual([
      { status: 'draft', count: 0 },
      { status: 'applied', count: 0 },
      { status: 'screening', count: 0 },
      { status: 'interview', count: 0 },
      { status: 'offer', count: 0 },
      { status: 'rejected', count: 0 },
      { status: 'withdrawn', count: 0 },
    ])
  })

  it('counts repeated statuses and preserves display order', () => {
    expect(countByStatus([
      application({ status: 'withdrawn' }), application(), application(),
      application({ status: 'draft' }), application({ status: 'screening' }),
      application({ status: 'interview' }), application({ status: 'offer' }),
      application({ status: 'rejected' }),
    ])).toEqual([
      { status: 'draft', count: 1 },
      { status: 'applied', count: 2 },
      { status: 'screening', count: 1 },
      { status: 'interview', count: 1 },
      { status: 'offer', count: 1 },
      { status: 'rejected', count: 1 },
      { status: 'withdrawn', count: 1 },
    ])
  })
})

describe('summarize', () => {
  it('returns zero totals for empty input', () => {
    expect(summarize([])).toEqual({ total: 0, inProgress: 0, rejected: 0 })
  })

  it('excludes drafts from the total', () => {
    expect(summarize([application({ status: 'draft' })]))
      .toEqual({ total: 0, inProgress: 0, rejected: 0 })
  })

  it.each([
    ['applied', 1, 0], ['screening', 1, 0], ['interview', 1, 0],
    ['offer', 0, 0], ['rejected', 0, 1], ['withdrawn', 0, 0],
  ] satisfies [Application['status'], number, number][])(
    'classifies %s independently', (status, inProgress, rejected) => {
      expect(summarize([application({ status })]))
        .toEqual({ total: 1, inProgress, rejected })
    },
  )

  it('combines repeated and mixed statuses even when dates are missing', () => {
    expect(summarize([
      application({ status: 'draft' }), application(), application(),
      application({ status: 'screening', appliedAt: null }),
      application({ status: 'interview' }), application({ status: 'offer' }),
      application({ status: 'rejected' }), application({ status: 'rejected' }),
      application({ status: 'withdrawn' }),
    ])).toEqual({ total: 8, inProgress: 4, rejected: 2 })
  })
})

it('does not mutate application records or their order during aggregation', () => {
  const input = [application({ appliedAt: '2026-03-01' }), application()]
  const original = structuredClone(input)
  input.forEach(Object.freeze)
  Object.freeze(input)
  countByMonth(input)
  countByStatus(input)
  summarize(input)
  expect(input).toEqual(original)
})
