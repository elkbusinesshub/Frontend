import React, { useState } from 'react'
import {
  useCheckPhoneQuery,
  useAddPhoneMutation,
} from '../../store/services/superadmin.service'
import { successMessageToast } from '../common/hooks/common'
import SuperAdminNav from './SuperAdminNav'
import SuperAdminSidebar from './SuperAdminSideBar'

const SuperAdminPhoneCheck = () => {
  const [searchInput, setSearchInput] = useState('')
  const [searchPhone, setSearchPhone] = useState(null)
  const [addInput, setAddInput] = useState('')

  const { data, isFetching, isError } = useCheckPhoneQuery(searchPhone, {
    skip: !searchPhone,
  })

  const [addPhone, { isLoading: adding }] = useAddPhoneMutation()

  const handleSearch = () => {
    if (!/^[0-9]{10}$/.test(searchInput)) {
      alert('Please enter a valid 10-digit phone number')
      return
    }
    setSearchPhone(searchInput)
  }

  const handleAdd = async () => {
    try {
      await addPhone({ phone_number: addInput }).unwrap()
      setAddInput('')
      successMessageToast('Phone number added successfully')
    } catch (err) {
      console.log(err?.data?.message ?? 'Failed to add phone number')
    }
  }

  return (
    <>
      <SuperAdminSidebar />
      <SuperAdminNav />
      <div className="container py-4" style={{ maxWidth: '600px' }}>
        <h4 className="mb-4 fw-bold">Phone Number Check</h4>

        {/* ── Search Section ── */}
        <div className="card p-4 mb-4 shadow-sm">
          <h6 className="mb-3 fw-semibold">Check Phone</h6>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter 10-digit phone number"
              value={searchInput}
              maxLength={10}
              onChange={(e) => {
                setSearchInput(e.target.value.replace(/\D/g, '')) // only digits
                setSearchPhone(null) // reset result on new input
              }}
              onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              className="btn"
              style={{ backgroundColor: '#4FBBB4', color: 'white' }}
              onClick={handleSearch}
              disabled={isFetching}
            >
              {isFetching ? 'Searching...' : 'Search'}
            </button>
          </div>

          {/* Result */}
          {searchPhone && !isFetching && (
            <div
              className={`alert mt-3 mb-0 ${data?.exists ? 'alert-success' : 'alert-warning'}`}
            >
              {data?.exists ? (
                <>
                  <strong>✅ Found!</strong> Notification was sent to{' '}
                  <strong>{searchPhone}</strong>
                  <br />
                  <small className="text-muted">
                    Added on: {new Date(data.created_at).toLocaleString()}
                  </small>
                </>
              ) : (
                <>
                  <strong>❌ Not Found.</strong> No notification has been sent
                  to <strong>{searchPhone}</strong>
                </>
              )}
            </div>
          )}
        </div>

        {/* ── Add Section ── */}
        <div className="card p-4 shadow-sm">
          <h6 className="mb-3 fw-semibold">Add Phone Number</h6>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter 10-digit phone number"
              value={addInput}
              maxLength={10}
              onChange={(e) => {
                setAddInput(e.target.value.replace(/\D/g, ''))
              }}
              onKeyUp={(e) => e.key === 'Enter' && handleAdd()}
            />
            <button
              className="btn"
              style={{ backgroundColor: '#FFDA3F', color: 'white' }}
              onClick={handleAdd}
              disabled={adding}
            >
              {adding ? 'Adding...' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default SuperAdminPhoneCheck
