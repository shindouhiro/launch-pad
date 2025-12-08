import { useState, useEffect } from 'react';
import { categoryApi } from '@/apis';
import { Category } from '@/apis/types';
import { message } from 'antd';

interface UseCategoriesOptions {
  autoFetch?: boolean;
  onError?: (error: Error) => void;
}

export function useCategories(options: UseCategoriesOptions = {}) {
  const { autoFetch = true, onError } = options;
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryApi.getAll();
      setCategories(res.data);
      return res.data;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      if (onError) {
        onError(err);
      } else {
        message.error('Failed to fetch categories');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchCategories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFetch]);

  return {
    categories,
    loading,
    fetchCategories,
    setCategories,
  };
}
