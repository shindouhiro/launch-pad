"use client";

import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Popconfirm,
  App,
  Upload,
  Image,
  Radio,
  Space,
  Tag,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  StarOutlined,
  StarFilled,
} from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import { useTranslations } from "next-intl";

type RecommendationItem = {
  id: string;
  title: string;
  url: string;
  icon: string;
  category: string;
  description: string;
  images?: string[];
  coverImage?: string;
};

export default function RecommendationsPage() {
  const { message } = App.useApp();
  const t = useTranslations("recommendations");
  const tCommon = useTranslations("common");
  const [data, setData] = useState<RecommendationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<RecommendationItem | null>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/recommendations`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      message.error(t("fetchFailed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setFileList([]);
    setExistingImages([]);
    setCoverImage("");
    setModalVisible(true);
  };

  const handleEdit = (record: RecommendationItem) => {
    setEditingRecord(record);
    form.setFieldsValue({
      title: record.title,
      url: record.url,
      icon: record.icon,
      category: record.category,
      description: record.description,
    });
    setFileList([]);
    setExistingImages(record.images || []);
    setCoverImage(record.coverImage || (record.images && record.images[0]) || "");
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`${API_BASE_URL}/recommendations/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success(t("deleteSuccess"));
      fetchData();
    } catch (error) {
      message.error(t("deleteFailed"));
    }
  };

  const handleRemoveExistingImage = (url: string) => {
    setExistingImages(existingImages.filter((img) => img !== url));
    if (coverImage === url) {
      const remaining = existingImages.filter((img) => img !== url);
      setCoverImage(remaining[0] || "");
    }
  };

  const uploadProps: UploadProps = {
    multiple: true,
    maxCount: 10,
    listType: "picture-card",
    fileList: fileList,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("只能上传图片文件！");
        return false;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("图片大小不能超过 5MB！");
        return false;
      }
      return false; // 阻止自动上传
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

  const handleSubmit = async (values: any) => {
    const token = localStorage.getItem("token");
    setUploading(true);

    try {
      const formData = new FormData();

      // 添加文本字段
      Object.keys(values).forEach((key) => {
        if (values[key] !== undefined && values[key] !== null) {
          formData.append(key, values[key]);
        }
      });

      // 添加新上传的图片
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("images", file.originFileObj);
        }
      });

      // 如果是编辑模式，需要处理现有图片
      if (editingRecord) {
        // 将保留的现有图片添加到表单数据
        formData.append("existingImages", JSON.stringify(existingImages));

        // 设置封面图片
        if (coverImage) {
          formData.append("coverImage", coverImage);
        }

        // 更新
        const response = await fetch(`${API_BASE_URL}/recommendations/${editingRecord.id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) throw new Error("Update failed");
        message.success(t("updateSuccess"));
      } else {
        // 创建 - 设置第一张图片为封面
        if (fileList.length > 0) {
          // 封面将在后端自动设置为第一张上传的图片
        }

        const response = await fetch(`${API_BASE_URL}/recommendations`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) throw new Error("Create failed");
        message.success(t("createSuccess"));
      }

      setModalVisible(false);
      fetchData();
      form.resetFields();
      setFileList([]);
      setExistingImages([]);
      setCoverImage("");
    } catch (error) {
      message.error(t("saveFailed"));
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const columns = [
    {
      title: "封面",
      dataIndex: "coverImage",
      key: "coverImage",
      width: 100,
      render: (coverImage: string, record: RecommendationItem) => {
        const imageUrl = coverImage || (record.images && record.images[0]);
        return imageUrl ? (
          <Image
            src={imageUrl}
            alt={record.title}
            width={60}
            height={60}
            style={{ objectFit: "cover", borderRadius: "4px" }}
          />
        ) : (
          <div
            style={{
              width: 60,
              height: 60,
              background: "#f0f0f0",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
            }}
          >
            {record.icon}
          </div>
        );
      },
    },
    {
      title: t("icon"),
      dataIndex: "icon",
      key: "icon",
      width: 80,
      render: (icon: string) => <span style={{ fontSize: "24px" }}>{icon}</span>,
    },
    {
      title: t("titleField"),
      dataIndex: "title",
      key: "title",
    },
    {
      title: t("url"),
      dataIndex: "url",
      key: "url",
      render: (url: string) => (
        <a href={url} target="_blank" rel="noopener noreferrer">
          {url}
        </a>
      ),
    },
    {
      title: t("category"),
      dataIndex: "category",
      key: "category",
      render: (category: string) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: "图片",
      dataIndex: "images",
      key: "images",
      render: (images: string[]) => (
        <span>{images && images.length > 0 ? `${images.length} 张` : "无"}</span>
      ),
    },
    {
      title: t("description"),
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: t("actions"),
      key: "actions",
      width: 150,
      render: (_: any, record: RecommendationItem) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title={t("deleteConfirm")}
            onConfirm={() => handleDelete(record.id)}
            okText={t("yes")}
            cancelText={t("no")}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0 }}>{t("title")}</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          {t("new")}
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingRecord ? t("edit") : t("new")}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={800}
        confirmLoading={uploading}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="title"
            label={t("titleField")}
            rules={[{ required: true, message: t("titleRequired") }]}
          >
            <Input placeholder={t("titlePlaceholder")} />
          </Form.Item>

          <Form.Item
            name="url"
            label={t("url")}
            rules={[
              { required: true, message: t("urlRequired") },
              { type: "url", message: t("urlInvalid") },
            ]}
          >
            <Input placeholder={t("urlPlaceholder")} />
          </Form.Item>

          <Form.Item
            name="category"
            label={t("category")}
            rules={[{ required: true, message: t("categoryRequired") }]}
          >
            <Select placeholder={t("categoryPlaceholder")}>
              <Select.Option value="Development">{tCommon("development")}</Select.Option>
              <Select.Option value="Productivity">{tCommon("productivity")}</Select.Option>
              <Select.Option value="Social">{tCommon("social")}</Select.Option>
              <Select.Option value="Entertainment">{tCommon("entertainment")}</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="icon" label={t("icon")}>
            <Input placeholder={t("iconPlaceholder")} maxLength={2} />
          </Form.Item>

          <Form.Item name="description" label={t("description")}>
            <Input.TextArea rows={3} placeholder={t("descriptionPlaceholder")} />
          </Form.Item>

          {/* 现有图片 */}
          {existingImages.length > 0 && (
            <Form.Item label="现有图片">
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {existingImages.map((url, index) => (
                  <div
                    key={url}
                    style={{
                      position: "relative",
                      width: "104px",
                      height: "104px",
                      border: coverImage === url ? "2px solid #1890ff" : "1px solid #d9d9d9",
                      borderRadius: "8px",
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      src={url}
                      alt={`image-${index}`}
                      width={100}
                      height={100}
                      style={{ objectFit: "cover" }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        left: 0,
                        bottom: 0,
                        background: "rgba(0,0,0,0.5)",
                        opacity: 0,
                        transition: "opacity 0.3s",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                      }}
                      className="image-overlay"
                    >
                      <Button
                        type="text"
                        size="small"
                        icon={coverImage === url ? <StarFilled /> : <StarOutlined />}
                        onClick={() => setCoverImage(url)}
                        style={{ color: "#fff" }}
                        title="设为封面"
                      />
                      <Button
                        type="text"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemoveExistingImage(url)}
                        style={{ color: "#fff" }}
                        title="删除"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <style jsx global>{`
                .image-overlay:hover {
                  opacity: 1 !important;
                }
              `}</style>
            </Form.Item>
          )}

          {/* 上传新图片 */}
          <Form.Item label="上传图片">
            <Upload {...uploadProps}>
              {fileList.length >= 10 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>上传</div>
                </div>
              )}
            </Upload>
            <div style={{ marginTop: "8px", color: "#999", fontSize: "12px" }}>
              支持上传最多 10 张图片，单张图片不超过 5MB
              {existingImages.length === 0 && fileList.length > 0 && (
                <div style={{ marginTop: "4px", color: "#1890ff" }}>
                  第一张图片将自动设为封面
                </div>
              )}
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
