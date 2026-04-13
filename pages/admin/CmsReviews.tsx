import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';
import { MessageSquare, Check, X, Trash2, Star } from 'lucide-react';

interface Review {
  id: number;
  name: string;
  event_type: string;
  rating: number;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

const CmsReviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('user_reviews')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching reviews:', error);
    } else {
      setReviews(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdateStatus = async (id: number, status: 'approved' | 'rejected') => {
    if (!supabase) return;
    const { error } = await supabase
      .from('user_reviews')
      .update({ status })
      .eq('id', id);
    if (error) {
      alert('Failed to update status');
    } else {
      setReviews(reviews.map(r => r.id === id ? { ...r, status } : r));
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this review permanently?')) return;
    if (!supabase) return;
    const { error } = await supabase
      .from('user_reviews')
      .delete()
      .eq('id', id);
    if (!error) {
      setReviews(reviews.filter(r => r.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Client Reviews</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and approve client testimonials to show on the public site.</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-black/20 text-left border-b border-gray-200 dark:border-white/10">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Client & Event</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Rating & Feedback</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">Loading reviews...</td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                        <MessageSquare className="h-8 w-8 mb-2 opacity-30" />
                        No reviews found.
                    </div>
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02]">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 dark:text-gray-200">{review.name}</p>
                      <p className="text-xs text-gray-500">{review.event_type}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(review.created_at).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4 max-w-md">
                      <div className="flex items-center gap-1 mb-2 text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={i < review.rating ? 'fill-current' : 'text-gray-300 dark:text-gray-600'} />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{review.message}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        review.status === 'approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                        review.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' :
                        'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                      }`}>
                        {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {review.status !== 'approved' && (
                          <button
                            onClick={() => handleUpdateStatus(review.id, 'approved')}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors"
                            title="Approve Review"
                          >
                            <Check size={18} />
                          </button>
                        )}
                        {review.status !== 'rejected' && (
                          <button
                            onClick={() => handleUpdateStatus(review.id, 'rejected')}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-lg transition-colors"
                            title="Reject Review"
                          >
                            <X size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors ml-2"
                          title="Delete Permanently"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CmsReviews;
