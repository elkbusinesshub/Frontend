import React, { useState } from 'react'
import './PriceDetailsForm.css'

export default function PriceDetailsForm({
  initialDetails = {},
  onClose,
  onSave,
}) {
  const [amount, setAmount] = useState(initialDetails.amount || '')
  const [category, setCategory] = useState(
    initialDetails.category || 'duration',
  )
  const [unit, setUnit] = useState(initialDetails.unit || '')

  const handleSave = () => {
    if (!amount || !unit) return alert('Complete all fields')
    onSave({ category, amount, unit })
  }

  const unitsMap = {
    duration: ['hour', 'day', 'week', 'month'],
    size: ['inch', 'centimeter'],
    custom: [],
  }

  return (
    <div className="modal-backdrop">
      <div className="price-details-form">
        <h4>Price Details</h4>

        <div className="form-group">
          <label>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="duration">Duration</option>
            <option value="size">Size</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div className="form-group">
          <label>Unit</label>
          {category === 'custom' ? (
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="Enter custom unit"
              required
            />
          ) : (
            <select value={unit} onChange={(e) => setUnit(e.target.value)}>
              <option value="">Select Unit</option>
              {unitsMap[category].map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          )}
        </div>


        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            value={amount}
            min="0"
            onChange={(e) => {
              const val = e.target.value
              if (val >= 0 || val === '') setAmount(val)
            }}
            onKeyDown={(e) => e.key === '-' && e.preventDefault()}
            // required
          />
        </div>

        <div className="form-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  )
}
