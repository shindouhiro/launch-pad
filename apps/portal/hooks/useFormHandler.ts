import { Form } from 'antd';
import { useCallback } from 'react';

export function useFormHandler() {
  const [form] = Form.useForm();

  const resetForm = useCallback(() => {
    form.resetFields();
  }, [form]);

  const setFormValues = useCallback((values: any) => {
    form.setFieldsValue(values);
  }, [form]);

  const validateAndGetValues = useCallback(async () => {
    return await form.validateFields();
  }, [form]);

  return {
    form,
    resetForm,
    setFormValues,
    validateAndGetValues,
  };
}
