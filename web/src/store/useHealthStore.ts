import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { HealthRecord, HealthAnalysis } from '@/types'

interface HealthState {
  records: HealthRecord[]
  currentRecord: HealthRecord | null
  analysis: HealthAnalysis | null
  loading: boolean
  error: string | null
  
  // Actions
  setRecords: (records: HealthRecord[]) => void
  addRecord: (record: HealthRecord) => void
  updateRecord: (id: number, record: HealthRecord) => void
  deleteRecord: (id: number) => void
  setCurrentRecord: (record: HealthRecord | null) => void
  setAnalysis: (analysis: HealthAnalysis | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

export const useHealthStore = create<HealthState>()(
  devtools(
    (set) => ({
      records: [],
      currentRecord: null,
      analysis: null,
      loading: false,
      error: null,

      setRecords: (records) => set({ records }),
      
      addRecord: (record) => set((state) => ({
        records: [record, ...state.records]
      })),
      
      updateRecord: (id, updatedRecord) => set((state) => ({
        records: state.records.map(record => 
          record.id === id ? updatedRecord : record
        )
      })),
      
      deleteRecord: (id) => set((state) => ({
        records: state.records.filter(record => record.id !== id)
      })),
      
      setCurrentRecord: (record) => set({ currentRecord: record }),
      setAnalysis: (analysis) => set({ analysis }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null })
    }),
    { name: 'health-store' }
  )
)