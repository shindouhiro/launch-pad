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
  Space,
  Tag,
  Card,
  Row,
  Col,
  Divider,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { categoryApi } from "@/apis";
import { Category } from "@/apis/types";

type RecommendationItem = {
  id: string;
  title: string;
  url: string;
  icon: string;
  category: string;
  categoryId?: string;
  description: string;
  images?: string[];
  coverImage?: string;
  imageGroups?: { name: string; images: string[] }[];
};

export default function RecommendationsPage() {
  const { message } = App.useApp();
  const t = useTranslations("recommendations");
  const [data, setData] = useState<RecommendationItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<RecommendationItem | null>(null);
  const [form] = Form.useForm();

  // Image Groups State
  const [imageGroups, setImageGroups] = useState<{ name: string; images: string[] }[]>([]);
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

  const fetchCategories = async () => {
    try {
      const res = await categoryApi.getAll();
      setCategories(res.data);
    } catch (error) {
      console.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, []);

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setImageGroups([]);
    setModalVisible(true);
  };

  const handleEdit = (record: RecommendationItem) => {
    setEditingRecord(record);
    form.setFieldsValue({
      title: record.title,
      url: record.url,
      icon: record.icon,
      categoryId: record.categoryId || (categories.find(c => c.name === record.category)?.id),
      description: record.description,
    });

    let groups = record.imageGroups || [];
    if (groups.length === 0 && record.images && record.images.length > 0) {
      groups = [{ name: "Default", images: record.images }];
    }
    setImageGroups(groups);
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

  const uploadFiles = async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/upload/multiple`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) throw new Error("Upload failed");
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
      message.success("上传成功");
    } catch (error) {
      message.error("上传失败");
    } finally {
      setUploading(false);
    }
    return false;
  };

  const handleRemoveImage = (groupIndex: number, imageUrl: string) => {
    const newGroups = [...imageGroups];
    newGroups[groupIndex].images = newGroups[groupIndex].images.filter(url => url !== imageUrl);
    setImageGroups(newGroups);
  };

  const addGroup = () => {
    setImageGroups([...imageGroups, { name: `Group ${imageGroups.length + 1}`, images: [] }]);
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

  const handleSubmit = async (values: any) => {
    const token = localStorage.getItem("token");
    setUploading(true);

    try {
      const allImages = imageGroups.flatMap(g => g.images);
      const coverImage = allImages.length > 0 ? allImages[0] : undefined;
      const selectedCategory = categories.find(c => c.id === values.categoryId);

      const payload = {
        ...values,
        category: selectedCategory?.name || "Unknown",
        categoryId: values.categoryId,
        imageGroups,
        images: allImages,
        coverImage: editingRecord?.coverImage || coverImage,
      };

      const url = editingRecord
        ? `${API_BASE_URL}/recommendations/${editingRecord.id}`
        : `${API_BASE_URL}/recommendations`;

      const method = editingRecord ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Operation failed");

      message.success(editingRecord ? t("updateSuccess") : t("createSuccess"));
      setModalVisible(false);
      fetchData();
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
      title: t("titleField"),
      dataIndex: "title",
      key: "title",
    },
    {
      title: t("category"),
      dataIndex: "category",
      key: "category",
      render: (category: string) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: "图片组",
      key: "groups",
      render: (_: any, record: RecommendationItem) => (
        <span>{record.imageGroups?.length || 0} 组</span>
      ),
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
      <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
        width={900}
        confirmLoading={uploading}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label={t("titleField")}
                rules={[{ required: true, message: t("titleRequired") }]}
              >
                <Input placeholder={t("titlePlaceholder")} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="categoryId"
                label={t("category")}
                rules={[{ required: true, message: t("categoryRequired") }]}
              >
                <Select placeholder={t("categoryPlaceholder")}>
                  {categories.map((category) => (
                    <Select.Option key={category.id} value={category.id}>
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
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
            </Col>
            <Col span={12}>
              <Form.Item name="icon" label={t("icon")}>
                <Input placeholder={t("iconPlaceholder")} maxLength={2} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label={t("description")}>
            <Input.TextArea rows={3} placeholder={t("descriptionPlaceholder")} />
          </Form.Item>

          <Divider>图片组管理</Divider>

          <div className="flex flex-col gap-4">
            {imageGroups.map((group, index) => (
              <Card
                key={index}
                size="small"
                title={
                  <Input
                    value={group.name}
                    onChange={(e) => updateGroupName(index, e.target.value)}
                    style={{ width: 200 }}
                    placeholder="分组名称"
                  />
                }
                extra={
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeGroup(index)}
                  >
                    删除分组
                  </Button>
                }
              >
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {group.images.map((url, imgIndex) => (
                    <div
                      key={imgIndex}
                      style={{
                        position: "relative",
                        width: "100px",
                        height: "100px",
                        border: "1px solid #d9d9d9",
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        src={url}
                        alt={`img-${imgIndex}`}
                        width={100}
                        height={100}
                        style={{ objectFit: "cover" }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: 0, right: 0,
                          background: "rgba(0,0,0,0.5)",
                          cursor: "pointer",
                          padding: "4px",
                          borderBottomLeftRadius: "4px"
                        }}
                        onClick={() => handleRemoveImage(index, url)}
                      >
                        <DeleteOutlined style={{ color: "white" }} />
                      </div>
                    </div>
                  ))}

                  <Upload
                    showUploadList={false}
                    beforeUpload={(file) => handleGroupUpload(index, file)}
                    multiple
                  >
                    <div style={{
                      width: "100px",
                      height: "100px",
                      border: "1px dashed #d9d9d9",
                      borderRadius: "8px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      background: "#fafafa"
                    }}>
                      <PlusOutlined />
                      <div style={{ marginTop: 8, fontSize: 12 }}>上传</div>
                    </div>
                  </Upload>
                </div>
              </Card>
            ))}

            <Button type="dashed" onClick={addGroup} icon={<PlusOutlined />} block>
              添加图片分组
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
