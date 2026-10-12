import { Sparkles, Loader2 } from 'lucide-react';

const AIInsightCard = ({ title, content, loading, error, onGenerate }) => {
  return (
    <div className="card bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200">
      <div className="flex items-center mb-4">
        <Sparkles className="h-6 w-6 text-purple-600 mr-2" />
        <h3 className="text-lg font-semibold text-navy-900">{title}</h3>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
          <span className="ml-3 text-gray-600">Generating AI insights...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && content && (
        <div className="bg-white rounded-lg p-4 text-gray-700 leading-relaxed">
          {content}
        </div>
      )}

      {!loading && !content && !error && (
        <div className="text-center py-4">
          <p className="text-gray-600 mb-4">Get AI-powered insights and recommendations</p>
          <button onClick={onGenerate} className="btn-primary">
            Generate AI Insights
          </button>
        </div>
      )}

      {content && !loading && (
        <p className="text-xs text-gray-500 mt-4 italic">
          ⚠️ AI-generated content. Please verify important details independently.
        </p>
      )}
    </div>
  );
};

export default AIInsightCard;
