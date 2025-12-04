"use client";

import { Table, Button, Modal, Form, Input, Select, Popconfirm, App } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

type RecommendationItem = {
  id: string;
  title: string;
  url: string;
  icon: string;
  category: string;
  description: string;
};

export default function RecommendationsPage() {
  const { message } = App.useApp();
  const t = useTranslations('recommendations');
  const tCommon = useTranslations('common');
  const [data, setData] = useState<RecommendationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<RecommendationItem | null>(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/recommendations");
      const result = await response.json();
      setData(result);
    } catch (error) {
      message.error(t('fetchFailed'));
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
    setModalVisible(true);
  };

  const handleEdit = (record: RecommendationItem) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`http://localhost:3001/recommendations/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success(t('deleteSuccess'));
      fetchData();
    } catch (error) {
      message.error(t('deleteFailed'));
    }
  };

  const handleSubmit = async (values: any) => {
    const token = localStorage.getItem("token");
    try {
      if (editingRecord) {
        // Update
        await fetch(`http://localhost:3001/recommendations/${editingRecord.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        });
        message.success(t('updateSuccess'));
      } else {
        // Create
        await fetch(`http://localhost:3001/recommendations`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        });
        message.success(t('createSuccess'));
      }
      setModalVisible(false);
      fetchData();
    } catch (error) {
      message.error(t('saveFailed'));
    }
  };

  const columns = [
    {
      title: t('icon'),
      dataIndex: "icon",
      key: "icon",
      width: 80,
      render: (icon: string) => <span style={{ fontSize: "24px" }}>{icon}</span>,
    },
    {
      title: t('titleField'),
      dataIndex: "title",
      key: "title",
    },
    {
      title: t('url'),
      dataIndex: "url",
      key: "url",
      render: (url: string) => (
        <a href={url} target="_blank" rel="noopener noreferrer">
          {url}
        </a>
      ),
    },
    {
      title: t('category'),
      dataIndex: "category",
      key: "category",
    },
    {
      title: t('description'),
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: t('actions'),
      key: "actions",
      width: 150,
      render: (_: any, record: RecommendationItem) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title={t('deleteConfirm')}
            onConfirm={() => handleDelete(record.id)}
            okText={t('yes')}
            cancelText={t('no')}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              {t('delete')}
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>{t('title')}</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          {t('new')}
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
        title={editingRecord ? t('edit') : t('new')}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="title"
            label={t('titleField')}
            rules={[{ required: true, message: t('titleRequired') }]}
          >
            <Input placeholder={t('titlePlaceholder')} />
          </Form.Item>

          <Form.Item
            name="url"
            label={t('url')}
            rules={[
              { required: true, message: t('urlRequired') },
              { type: "url", message: t('urlInvalid') },
            ]}
          >
            <Input placeholder={t('urlPlaceholder')} />
          </Form.Item>

          <Form.Item
            name="category"
            label={t('category')}
            rules={[{ required: true, message: t('categoryRequired') }]}
          >
            <Select placeholder={t('categoryPlaceholder')}>
              <Select.Option value="Development">{tCommon('development')}</Select.Option>
              <Select.Option value="Productivity">{tCommon('productivity')}</Select.Option>
              <Select.Option value="Social">{tCommon('social')}</Select.Option>
              <Select.Option value="Entertainment">{tCommon('entertainment')}</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="icon"
            label={t('icon')}
          >
            <Input placeholder={t('iconPlaceholder')} maxLength={2} />
          </Form.Item>

          <Form.Item
            name="description"
            label={t('description')}
          >
            <Input.TextArea rows={3} placeholder={t('descriptionPlaceholder')} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
