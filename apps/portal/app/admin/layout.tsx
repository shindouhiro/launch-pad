"use client";

import { ProLayout } from "@ant-design/pro-components";
import { Dropdown } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "../components/LanguageSwitcher";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const t = useTranslations('admin');

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!isClient) return null;

  return (
    <ProLayout
      title={t('title')}
      logo="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
      layout="mix"
      splitMenus={false}
      avatarProps={{
        src: "https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg",
        title: "Admin",
        render: (props, dom) => {
          return (
            <Dropdown
              menu={{
                items: [
                  {
                    key: "logout",
                    icon: <LogoutOutlined />,
                    label: t('logout'),
                    onClick: () => {
                      localStorage.removeItem("token");
                      router.push("/admin/login");
                    },
                  },
                ],
              }}
            >
              {dom}
            </Dropdown>
          );
        },
      }}
      menuDataRender={() => [
        {
          path: "/admin/recommendations",
          name: t('recommendations'),
          icon: "smile",
        },
        {
          path: "/admin/categories",
          name: t('categories'),
          icon: "appstore",
        },
      ]}
      menuItemRender={(item, dom) => (
        <Link href={item.path || "/admin"}>{dom}</Link>
      )}
      location={{
        pathname,
      }}
      actionsRender={() => [<LanguageSwitcher key="lang" />]}
    >
      {children}
    </ProLayout>
  );
}
