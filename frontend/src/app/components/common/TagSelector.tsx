import React from 'react';
import { Tag } from '../../../types';

interface TagSelectorProps {
  tags: Tag[];
  selectedTagIds: string[];
  onToggle: (tagId: string) => void;
  disabled?: boolean;
}

const TagSelector: React.FC<TagSelectorProps> = ({
  tags,
  selectedTagIds,
  onToggle,
  disabled = false
}) => {
  return (
    <div className="tag-selector">
      <label>Select Tags:</label>
      <div className="tag-options">
        {tags.map(tag => (
          <label key={tag.id} className="tag-option">
            <input
              type="checkbox"
              checked={selectedTagIds.includes(tag.id)}
              onChange={() => !disabled && onToggle(tag.id)}
              disabled={disabled}
            />
            <span
              className="tag-badge"
              style={{ backgroundColor: tag.color }}
            >
              {tag.name}
            </span>
          </label>
        ))}
      </div>
      <style jsx>{`
        .tag-selector {
          display: flex;
          flex-direction: column;
        }
        label {
          margin-bottom: 8px;
          font-weight: bold;
        }
        .tag-options {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .tag-option {
          display: flex;
          align-items: center;
          cursor: pointer;
          padding: 4px 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .tag-option input {
          margin-right: 4px;
        }
        .tag-badge {
          padding: 2px 6px;
          border-radius: 4px;
          color: white;
          font-size: 0.8em;
        }
        .tag-option input:disabled {
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default TagSelector;