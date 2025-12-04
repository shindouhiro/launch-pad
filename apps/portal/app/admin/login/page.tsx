"use client";

import { LoginForm, ProFormText } from "@ant-design/pro-components";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Tabs, App } from "antd";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "../../components/LanguageSwitcher";

export default function LoginPage() {
  const router = useRouter();
  const { message } = App.useApp();
  const t = useTranslations('admin');

  const handleSubmit = async (values: any) => {
    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.access_token);
        message.success(t('loginSuccess'));
        router.push("/admin/recommendations");
      } else {
        message.error(t('loginFailed'));
      }
    } catch (error) {
      message.error(t('loginError'));
    }
  };

  return (
    <div style={{ backgroundColor: "white", height: "100vh", position: "relative" }}>
      <div style={{ position: "absolute", top: "20px", right: "20px" }}>
        <LanguageSwitcher />
      </div>
      <LoginForm
        title={t('title')}
        subTitle={t('subtitle')}
        onFinish={handleSubmit}
      >
        <Tabs
          centered
          items={[
            {
              key: "account",
              label: t('login'),
            },
          ]}
        />
        <ProFormText
          name="username"
          fieldProps={{
            size: "large",
            prefix: <UserOutlined />,
          }}
          placeholder={t('usernamePlaceholder')}
          rules={[
            {
              required: true,
              message: t('usernameRequired'),
            },
          ]}
        />
        <ProFormText.Password
          name="password"
          fieldProps={{
            size: "large",
            prefix: <LockOutlined />,
          }}
          placeholder={t('passwordPlaceholder')}
          rules={[
            {
              required: true,
              message: t('passwordRequired'),
            },
          ]}
        />
      </LoginForm>
    </div>
  );
}
