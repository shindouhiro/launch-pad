"use client";

import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, InputNumber, message, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { categoryApi } from "@/apis";
import { Category } from "@/apis/types";
import { useTranslations } from "next-intl";

export default function CategoriesPage() {
  const t = useTranslations("categories");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryApi.getAll();
      setCategories(res.data);
    } catch (error) {
      message.error(t("fetchFailed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = () => {
    setEditingCategory(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record: Category) => {
    setEditingCategory(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await categoryApi.delete(id);
      message.success(t("deleteSuccess"));
      fetchCategories();
    } catch (error) {
      message.error(t("operationFailed"));
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingCategory) {
        await categoryApi.update(editingCategory.id, values);
        message.success(t("updateSuccess"));
      } else {
        await categoryApi.create(values);
        message.success(t("createSuccess"));
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      message.error(t("operationFailed"));
    }
  };

  const columns = [
    {
      title: t("name"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("sortOrder"),
      dataIndex: "sortOrder",
      key: "sortOrder",
    },
    {
      title: t("actions"),
      key: "actions",
      render: (_: any, record: Category) => (
        <div className="flex gap-2">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title={t("deleteCategory")}
            description={t("deleteConfirm")}
            onConfirm={() => handleDelete(record.id)}
            okText={t("yes")}
            cancelText={t("no")}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          {t("addCategory")}
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingCategory ? t("editCategory") : t("addCategory")}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label={t("name")}
            rules={[{ required: true, message: t("nameRequired") }]}
          >
            <Input placeholder={t("namePlaceholder")} />
          </Form.Item>
          <Form.Item
            name="sortOrder"
            label={t("sortOrder")}
            initialValue={0}
          >
            <InputNumber className="w-full" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
