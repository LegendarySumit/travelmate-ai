import { Trash2, Calendar } from 'lucide-react';
import LoadingState from './LoadingState';

const SavedItemsList = ({ 
  items = [], 
  loading, 
  onDelete, 
  onItemClick,
  emptyMessage = 'No saved items yet' 
}) => {
  if (loading) {
    return <LoadingState message="Loading saved items..." />;
  }

  if (items.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="card flex items-center justify-between hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => onItemClick && onItemClick(item)}
        >
          <div className="flex-1">
            <h3 className="font-semibold text-navy-900 mb-1">{item.name}</h3>
            {item.details && (
              <p className="text-sm text-gray-600">{item.details}</p>
            )}
            {item.savedAt && (
              <div className="flex items-center text-xs text-gray-500 mt-2">
                <Calendar className="h-3 w-3 mr-1" />
                Saved on {new Date(item.savedAt).toLocaleDateString()}
              </div>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors ml-4"
            aria-label="Delete item"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default SavedItemsList;
