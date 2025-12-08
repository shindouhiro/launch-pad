"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { recommendationApi } from "@/apis";
import { Recommendation } from "@/apis/types";
import { Button, Spin, Tabs, Image } from "antd";
import { ArrowLeftOutlined, GlobalOutlined } from "@ant-design/icons";
import Link from "next/link";

export default function AppDetailPage() {
  const params = useParams();
  const [app, setApp] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApp = async () => {
      if (params.id) {
        try {
          const res = await recommendationApi.getById(params.id as string);
          setApp(res.data);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchApp();
  }, [params.id]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><Spin size="large" /></div>;
  }

  if (!app) {
    return <div className="flex h-screen items-center justify-center">App not found</div>;
  }

  // Prepare tabs items
  const items = (app.imageGroups || []).map((group, index) => ({
    key: String(index),
    label: group.name,
    children: (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {group.images.map((img, i) => (
          <div key={i} className="group relative aspect-[16/10] overflow-hidden rounded-xl bg-slate-800 border border-slate-700/50 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-rose-500/20 hover:border-rose-500/30">
            <Image
              src={img}
              alt={`${group.name}-${i}`}
              className="object-cover w-full h-full"
            />
          </div>
        ))}
      </div>
    ),
  }));

  // Fallback for legacy images if no groups
  if (items.length === 0 && app.images && app.images.length > 0) {
    items.push({
      key: "default",
      label: "Gallery",
      children: (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {app.images.map((img, i) => (
            <div key={i} className="group relative aspect-[16/10] overflow-hidden rounded-xl bg-slate-800 border border-slate-700/50 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-rose-500/20 hover:border-rose-500/30">
              <Image
                src={img}
                alt={`gallery-${i}`}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      ),
    });
  }

  return (
    <main className="min-h-screen bg-slate-950 pb-20 text-slate-100 selection:bg-rose-500/30 selection:text-rose-200">
      {/* Hero Section */}
      <div className="relative h-[450px] w-full overflow-hidden">
        {/* Background Image with Blur */}
        <div className="absolute inset-0">
          {app.coverImage && (
            <img src={app.coverImage} className="h-full w-full object-cover opacity-40 blur-2xl scale-110" alt="bg" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-end pb-16">
          <Link href="/" className="absolute top-8 left-4 text-slate-300 hover:text-white flex items-center gap-2 transition-colors px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10">
            <ArrowLeftOutlined /> Back to Home
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-end">
            <div className="h-32 w-32 rounded-3xl bg-slate-800/50 backdrop-blur-xl p-4 shadow-2xl flex items-center justify-center text-6xl border border-white/10 ring-1 ring-white/5">
              {app.icon}
            </div>
            <div className="flex-1 mb-2">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">{app.title}</h1>
              <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">{app.description}</p>
            </div>
            <div className="mb-4">
              <Button
                type="primary"
                size="large"
                icon={<GlobalOutlined />}
                href={app.url}
                target="_blank"
                className="bg-rose-600 hover:bg-rose-500 border-none h-12 px-8 text-lg shadow-lg shadow-rose-500/20"
              >
                Visit Website
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 mt-8">
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/5">
          <Tabs
            defaultActiveKey="0"
            items={items}
            size="large"
            className="custom-tabs"
            tabBarStyle={{ color: '#94a3b8' }}
          />
        </div>
      </div>

      <style jsx global>{`
        .ant-tabs-tab {
          color: #94a3b8 !important;
          font-size: 16px !important;
          padding: 12px 0 !important;
          transition: all 0.3s !important;
        }
        .ant-tabs-tab:hover {
          color: #e2e8f0 !important;
        }
        .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #fff !important;
          text-shadow: 0 0 20px rgba(255,255,255,0.5);
        }
        .ant-tabs-ink-bar {
          background: #f43f5e !important;
          height: 3px !important;
          border-radius: 3px !important;
          box-shadow: 0 0 10px #f43f5e;
        }
      `}</style>
    </main>
  );
}
