import React from 'react';
import { Priority } from '../../../types';

interface PrioritySelectorProps {
  priorities: Priority[];
  selectedPriorityId: string | null;
  onSelect: (priorityId: string | null) => void;
  disabled?: boolean;
}

const PrioritySelector: React.FC<PrioritySelectorProps> = ({
  priorities,
  selectedPriorityId,
  onSelect,
  disabled = false
}) => {
  return (
    <div className="priority-selector">
      <label htmlFor="priority-select">Priority:</label>
      <select
        id="priority-select"
        value={selectedPriorityId || ''}
        onChange={(e) => onSelect(e.target.value || null)}
        disabled={disabled}
        className="priority-select"
      >
        <option value="">None</option>
        {priorities.map(priority => (
          <option key={priority.id} value={priority.id}>
            {priority.name} (Value: {priority.value})
          </option>
        ))}
      </select>
      <style jsx>{`
        .priority-selector {
          display: flex;
          flex-direction: column;
        }
        label {
          margin-bottom: 4px;
          font-weight: bold;
        }
        .priority-select {
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
        }
        .priority-select:disabled {
          background-color: #f5f5f5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default PrioritySelector;