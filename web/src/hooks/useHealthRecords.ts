import { useEffect } from 'react'
import { healthRecordsApi } from '@/services/api'
import { useHealthStore } from '@/store/useHealthStore'
import type { HealthRecord, CreateHealthRecordData } from '@/types'

export function useHealthRecords() {
  const { 
    records, 
    loading, 
    error, 
    setRecords, 
    addRecord, 
    updateRecord, 
    deleteRecord, 
    setLoading, 
    setError,
    clearError 
  } = useHealthStore()

  // Fetch records on mount
  useEffect(() => {
    fetchRecords()
  }, [])

  const fetchRecords = async () => {
    try {
      setLoading(true)
      clearError()
      const data = await healthRecordsApi.getRecords()
      setRecords(data)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch health records')
    } finally {
      setLoading(false)
    }
  }

  const createRecord = async (data: CreateHealthRecordData): Promise<HealthRecord> => {
    try {
      clearError()
      const newRecord = await healthRecordsApi.createRecord(data)
      addRecord(newRecord)
      return newRecord
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to create health record'
      setError(errorMessage)
      throw err
    }
  }

  const updateHealthRecord = async (id: number, data: CreateHealthRecordData): Promise<HealthRecord> => {
    try {
      clearError()
      const updatedRecord = await healthRecordsApi.updateRecord(id, data)
      updateRecord(id, updatedRecord)
      return updatedRecord
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to update health record'
      setError(errorMessage)
      throw err
    }
  }

  const deleteHealthRecord = async (id: number): Promise<void> => {
    try {
      clearError()
      await healthRecordsApi.deleteRecord(id)
      deleteRecord(id)
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to delete health record'
      setError(errorMessage)
      throw err
    }
  }

  const getRecord = async (id: number): Promise<HealthRecord> => {
    try {
      clearError()
      return await healthRecordsApi.getRecord(id)
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch health record'
      setError(errorMessage)
      throw err
    }
  }

  return {
    records,
    loading,
    error,
    fetchRecords,
    createRecord,
    updateRecord: updateHealthRecord,
    deleteRecord: deleteHealthRecord,
    getRecord,
    clearError
  }
}