'use client';

import { useState } from 'react';
import { Upload, Button, Form, Input, message, Image } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';

interface RecommendationFormData {
  title: string;
  url: string;
  icon: string;
  category: string;
  description: string;
}

export default function RecommendationImageUpload() {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // 上传配置
  const uploadProps: UploadProps = {
    name: 'images',
    multiple: true,
    maxCount: 10,
    listType: 'picture-card',
    fileList: fileList,
    beforeUpload: (file) => {
      // 验证文件类型
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('只能上传图片文件！');
        return false;
      }

      // 验证文件大小（5MB）
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('图片大小不能超过 5MB！');
        return false;
      }

      return false; // 阻止自动上传，手动控制
    },
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList);
    },
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
  };

  // 提交表单
  const handleSubmit = async (values: RecommendationFormData) => {
    setLoading(true);

    try {
      const formData = new FormData();

      // 添加文本字段
      Object.keys(values).forEach((key) => {
        formData.append(key, values[key as keyof RecommendationFormData]);
      });

      // 添加图片文件
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append('images', file.originFileObj);
        }
      });

      // 发送请求
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('创建失败');
      }

      const result = await response.json();
      message.success('创建成功！');

      // 重置表单
      form.resetFields();
      setFileList([]);
      setImageUrls(result.images || []);
    } catch (error) {
      message.error('创建失败：' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // 单独上传图片
  const handleUploadImages = async () => {
    if (fileList.length === 0) {
      message.warning('请先选择图片');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append('files', file.originFileObj);
        }
      });

      const response = await fetch('/api/upload/multiple', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('上传失败');
      }

      const result = await response.json();
      const urls = result.data.map((item: { url: string }) => item.url);
      setImageUrls([...imageUrls, ...urls]);
      message.success('上传成功！');
      setFileList([]);
    } catch (error) {
      message.error('上传失败：' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // 删除已上传的图片
  const handleDeleteImage = async (url: string) => {
    try {
      const response = await fetch('/api/upload/single', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('删除失败');
      }

      setImageUrls(imageUrls.filter((u) => u !== url));
      message.success('删除成功！');
    } catch (error) {
      message.error('删除失败：' + (error as Error).message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">创建推荐</h1>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="space-y-4"
      >
        <Form.Item
          label="标题"
          name="title"
          rules={[{ required: true, message: '请输入标题' }]}
        >
          <Input placeholder="请输入标题" />
        </Form.Item>

        <Form.Item
          label="链接"
          name="url"
          rules={[
            { required: true, message: '请输入链接' },
            { type: 'url', message: '请输入有效的 URL' },
          ]}
        >
          <Input placeholder="https://example.com" />
        </Form.Item>

        <Form.Item
          label="图标"
          name="icon"
          rules={[{ required: true, message: '请输入图标' }]}
        >
          <Input placeholder="🚀" />
        </Form.Item>

        <Form.Item
          label="分类"
          name="category"
          rules={[{ required: true, message: '请输入分类' }]}
        >
          <Input placeholder="Development" />
        </Form.Item>

        <Form.Item
          label="描述"
          name="description"
          rules={[{ required: true, message: '请输入描述' }]}
        >
          <Input.TextArea rows={4} placeholder="请输入描述" />
        </Form.Item>

        <Form.Item label="图片上传">
          <Upload {...uploadProps}>
            {fileList.length >= 10 ? null : (
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>上传</div>
              </div>
            )}
          </Upload>
          <div className="mt-2 text-gray-500 text-sm">
            支持上传最多 10 张图片，单张图片不超过 5MB
          </div>
        </Form.Item>

        <Form.Item>
          <div className="flex gap-2">
            <Button type="primary" htmlType="submit" loading={loading}>
              创建推荐
            </Button>
            <Button onClick={handleUploadImages} loading={loading}>
              单独上传图片
            </Button>
          </div>
        </Form.Item>
      </Form>

      {/* 已上传的图片预览 */}
      {imageUrls.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">已上传的图片</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative group">
                <Image
                  src={url}
                  alt={`上传图片 ${index + 1}`}
                  className="w-full h-32 object-cover rounded"
                />
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  size="small"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDeleteImage(url)}
                >
                  删除
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
