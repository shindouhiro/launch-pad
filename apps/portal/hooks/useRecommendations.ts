import { useState, useEffect } from 'react';
import { recommendationApi } from '@/apis';
import { Recommendation } from '@/apis/types';
import { message } from 'antd';

interface UseRecommendationsOptions {
  autoFetch?: boolean;
  onError?: (error: any) => void;
}

export function useRecommendations(options: UseRecommendationsOptions = {}) {
  const { autoFetch = true, onError } = options;
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await recommendationApi.getAll();
      setRecommendations(res.data);
      return res.data;
    } catch (error) {
      if (onError) {
        onError(error);
      } else {
        message.error('Failed to fetch recommendations');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchRecommendations();
    }
  }, [autoFetch]);

  return {
    recommendations,
    loading,
    fetchRecommendations,
    setRecommendations,
  };
}
