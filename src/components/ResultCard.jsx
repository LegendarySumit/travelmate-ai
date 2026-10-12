import { Heart, Trash2 } from 'lucide-react';

const ResultCard = ({ 
  children, 
  onSave, 
  onDelete, 
  isSaved = false, 
  showActions = true 
}) => {
  return (
    <div className="card relative">
      {showActions && (
        <div className="absolute top-4 right-4 flex gap-2">
          {!isSaved && onSave && (
            <button
              onClick={onSave}
              className="p-2 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
              aria-label="Save"
            >
              <Heart className="h-5 w-5" />
            </button>
          )}
          {isSaved && onDelete && (
            <button
              onClick={onDelete}
              className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
              aria-label="Delete"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default ResultCard;
