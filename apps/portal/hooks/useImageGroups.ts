import { useState } from 'react';
import { message } from 'antd';

export interface ImageGroup {
  name: string;
  images: string[];
}

interface UseImageGroupsOptions {
  apiBaseUrl?: string;
}

export function useImageGroups(options: UseImageGroupsOptions = {}) {
  const { apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001' } = options;
  const [imageGroups, setImageGroups] = useState<ImageGroup[]>([]);
  const [uploading, setUploading] = useState(false);

  const uploadFiles = async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    const token = localStorage.getItem('token');

    const response = await fetch(`${apiBaseUrl}/upload/multiple`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) throw new Error('Upload failed');
    const result = await response.json();
    return result.data.map((item: any) => item.url);
  };

  const handleGroupUpload = async (groupIndex: number, file: File) => {
    try {
      setUploading(true);
      const urls = await uploadFiles([file]);
      const newGroups = [...imageGroups];
      newGroups[groupIndex].images = [...newGroups[groupIndex].images, ...urls];
      setImageGroups(newGroups);
      message.success('上传成功');
    } catch (error) {
      message.error('上传失败');
    } finally {
      setUploading(false);
    }
    return false;
  };

  const handleRemoveImage = (groupIndex: number, imageUrl: string) => {
    const newGroups = [...imageGroups];
    newGroups[groupIndex].images = newGroups[groupIndex].images.filter(
      (url) => url !== imageUrl
    );
    setImageGroups(newGroups);
  };

  const addGroup = () => {
    setImageGroups([
      ...imageGroups,
      { name: `Group ${imageGroups.length + 1}`, images: [] },
    ]);
  };

  const removeGroup = (index: number) => {
    const newGroups = [...imageGroups];
    newGroups.splice(index, 1);
    setImageGroups(newGroups);
  };

  const updateGroupName = (index: number, name: string) => {
    const newGroups = [...imageGroups];
    newGroups[index].name = name;
    setImageGroups(newGroups);
  };

  const resetGroups = () => {
    setImageGroups([]);
  };

  const initializeGroups = (groups: ImageGroup[], legacyImages?: string[]) => {
    if (groups && groups.length > 0) {
      setImageGroups(groups);
    } else if (legacyImages && legacyImages.length > 0) {
      setImageGroups([{ name: 'Default', images: legacyImages }]);
    } else {
      setImageGroups([]);
    }
  };

  return {
    imageGroups,
    uploading,
    setImageGroups,
    handleGroupUpload,
    handleRemoveImage,
    addGroup,
    removeGroup,
    updateGroupName,
    resetGroups,
    initializeGroups,
  };
}
