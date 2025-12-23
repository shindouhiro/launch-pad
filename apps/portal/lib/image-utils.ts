/**
 * 图片 URL 工具函数
 */

/**
 * 确保图片 URL 使用正确的协议
 * 
 * ⚠️ 注意：七牛云测试域名（*.hn-bkt.clouddn.com）不支持 HTTPS
 * 如果使用测试域名，此函数会保持 HTTP 协议
 * 如果已配置自定义域名并启用 HTTPS，请修改此函数以转换为 HTTPS
 * 
 * @param url - 原始图片 URL
 * @returns 处理后的图片 URL
 * 
 * @example
 * ```ts
 * // 暂时保持原协议（测试域名）
 * ensureHttps('http://t6yfyzu7s.hn-bkt.clouddn.com/image.png')
 * // => 'http://t6yfyzu7s.hn-bkt.clouddn.com/image.png'
 * 
 * // 配置自定义域名后，可以转换为 HTTPS
 * // ensureHttps('http://cdn.yourdomain.com/image.png')
 * // => 'https://cdn.yourdomain.com/image.png'
 * ```
 */
export function ensureHttps(url: string | null | undefined): string {
  if (!url) return '';

  // ⚠️ 暂时不转换协议，因为七牛云测试域名不支持 HTTPS
  // 
  // 如果你已经配置了自定义域名并启用了 HTTPS，
  // 请取消下面的注释以启用 HTTP -> HTTPS 转换：
  //
  // if (url.startsWith('http://')) {
  //   return url.replace('http://', 'https://');
  // }

  return url;
}

/**
 * 批量转换图片 URL
 * 
 * @param urls - 图片 URL 数组
 * @returns 处理后的图片 URL 数组
 */
export function ensureHttpsArray(urls: (string | null | undefined)[]): string[] {
  return urls.map(ensureHttps).filter(Boolean);
}

/**
 * 为对象中的图片字段转换协议
 * 
 * @param obj - 包含图片 URL 的对象
 * @param fields - 需要转换的字段名数组
 * @returns 转换后的对象
 */
export function ensureHttpsFields<T extends Record<string, any>>(
  obj: T,
  fields: (keyof T)[]
): T {
  const result = { ...obj };

  fields.forEach((field) => {
    if (typeof result[field] === 'string') {
      result[field] = ensureHttps(result[field] as string) as T[keyof T];
    }
  });

  return result;
}

/**
 * 检查 URL 是否为 HTTPS
 */
export function isHttps(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.startsWith('https://');
}

/**
 * 检查 URL 是否为 HTTP
 */
export function isHttp(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.startsWith('http://');
}
