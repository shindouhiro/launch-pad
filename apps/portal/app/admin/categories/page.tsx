"use client";

import { Table, Button, Modal, Form, Input, InputNumber, message, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { categoryApi } from "@/apis";
import { Category } from "@/apis/types";
import { useTranslations } from "next-intl";
import { useCategories, useModal, useFormHandler } from "@/hooks";

export default function CategoriesPage() {
  const t = useTranslations("categories");
  const { categories, loading, fetchCategories } = useCategories();
  const modal = useModal<Category>();
  const { form, resetForm, setFormValues, validateAndGetValues } = useFormHandler();

  const handleAdd = () => {
    resetForm();
    modal.open();
  };

  const handleEdit = (record: Category) => {
    setFormValues(record);
    modal.open(record);
  };

  const handleDelete = async (id: string) => {
    try {
      await categoryApi.delete(id);
      message.success(t("deleteSuccess"));
      fetchCategories();
    } catch {
      message.error(t("operationFailed"));
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await validateAndGetValues();
      if (modal.data) {
        await categoryApi.update(modal.data.id, values);
        message.success(t("updateSuccess"));
      } else {
        await categoryApi.create(values);
        message.success(t("createSuccess"));
      }
      modal.close();
      fetchCategories();
    } catch {
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
      render: (_: unknown, record: Category) => (
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
        title={modal.data ? t("editCategory") : t("addCategory")}
        open={modal.isOpen}
        onOk={handleSubmit}
        onCancel={modal.close}
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
