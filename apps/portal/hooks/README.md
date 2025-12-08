# Custom React Hooks

这个目录包含了项目中可复用的自定义 React Hooks。

## Hooks 列表

### 1. useCategories

用于获取和管理分类数据。

```tsx
import { useCategories } from '@/hooks';

function MyComponent() {
  const { categories, loading, fetchCategories } = useCategories();
  
  // categories: Category[] - 分类列表
  // loading: boolean - 加载状态
  // fetchCategories: () => Promise<Category[]> - 重新获取数据
}
```

**选项:**
- `autoFetch?: boolean` - 是否自动获取数据（默认: true）
- `onError?: (error: any) => void` - 错误处理回调

### 2. useRecommendations

用于获取和管理推荐数据。

```tsx
import { useRecommendations } from '@/hooks';

function MyComponent() {
  const { recommendations, loading, fetchRecommendations } = useRecommendations();
  
  // recommendations: Recommendation[] - 推荐列表
  // loading: boolean - 加载状态
  // fetchRecommendations: () => Promise<Recommendation[]> - 重新获取数据
}
```

**选项:**
- `autoFetch?: boolean` - 是否自动获取数据（默认: true）
- `onError?: (error: any) => void` - 错误处理回调

### 3. useModal

用于管理模态框状态。

```tsx
import { useModal } from '@/hooks';

function MyComponent() {
  const modal = useModal<DataType>();
  
  // modal.isOpen: boolean - 模态框是否打开
  // modal.data: DataType | null - 模态框数据
  // modal.open(data?: DataType) - 打开模态框
  // modal.close() - 关闭模态框
  // modal.toggle() - 切换模态框状态
}
```

**示例:**
```tsx
const modal = useModal<Category>();

// 打开模态框并传入数据
modal.open(categoryData);

// 在模态框中使用数据
if (modal.data) {
  console.log(modal.data.id);
}

// 关闭模态框
modal.close();
```

### 4. useImageGroups

用于管理图片组（上传、删除、编辑）。

```tsx
import { useImageGroups } from '@/hooks';

function MyComponent() {
  const {
    imageGroups,
    uploading,
    handleGroupUpload,
    handleRemoveImage,
    addGroup,
    removeGroup,
    updateGroupName,
    resetGroups,
    initializeGroups,
  } = useImageGroups();
  
  // imageGroups: ImageGroup[] - 图片组列表
  // uploading: boolean - 上传状态
  // handleGroupUpload: (groupIndex: number, file: File) => Promise<boolean>
  // handleRemoveImage: (groupIndex: number, imageUrl: string) => void
  // addGroup: () => void - 添加新组
  // removeGroup: (index: number) => void - 删除组
  // updateGroupName: (index: number, name: string) => void - 更新组名
  // resetGroups: () => void - 重置所有组
  // initializeGroups: (groups: ImageGroup[], legacyImages?: string[]) => void
}
```

### 5. useFormHandler

用于简化 Ant Design Form 的操作。

```tsx
import { useFormHandler } from '@/hooks';

function MyComponent() {
  const { form, resetForm, setFormValues, validateAndGetValues } = useFormHandler();
  
  // form: FormInstance - Ant Design 表单实例
  // resetForm: () => void - 重置表单
  // setFormValues: (values: any) => void - 设置表单值
  // validateAndGetValues: () => Promise<any> - 验证并获取表单值
}
```

**示例:**
```tsx
const { form, resetForm, setFormValues, validateAndGetValues } = useFormHandler();

// 重置表单
resetForm();

// 设置表单值
setFormValues({ name: 'Test', sortOrder: 1 });

// 验证并获取值
const values = await validateAndGetValues();
```

## 最佳实践

1. **组合使用 Hooks**: 多个 hooks 可以组合使用以实现复杂功能
   ```tsx
   const { categories, loading } = useCategories();
   const modal = useModal<Category>();
   const { form, setFormValues } = useFormHandler();
   ```

2. **错误处理**: 使用 `onError` 回调自定义错误处理
   ```tsx
   const { categories } = useCategories({
     onError: (error) => {
       console.error('Custom error handling:', error);
     }
   });
   ```

3. **条件获取**: 使用 `autoFetch: false` 手动控制数据获取时机
   ```tsx
   const { fetchCategories } = useCategories({ autoFetch: false });
   
   useEffect(() => {
     if (someCondition) {
       fetchCategories();
     }
   }, [someCondition]);
   ```

## 贡献指南

创建新的 hook 时，请遵循以下规范：

1. 文件名使用 `use` 前缀，如 `useMyHook.ts`
2. 导出的 hook 函数也使用 `use` 前缀
3. 在 `hooks/index.ts` 中导出新的 hook
4. 更新此 README 文档
5. 添加 TypeScript 类型定义
6. 提供使用示例
