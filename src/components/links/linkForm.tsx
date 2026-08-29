import { useState } from 'react';
import Image from 'next/image';
import {
  Link,
  CreateLinkData,
  LinkPlatform,
} from '@/types';
import {
  getPlatformIcon,
  getCategoryByPlatform
} from '@/utils';
import { Card, Button, Input, Select } from '@/components/ui';

interface LinkFormProps {
  link?: Link;
  onSubmit: (data: CreateLinkData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const platformOptions = Object.entries(LinkPlatform).map(([key, value]) => ({
  value,
  label: key.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}));

export const LinkForm = ({ link, onSubmit, onCancel, isLoading = false }: LinkFormProps) => {
  const [formData, setFormData] = useState<Omit<CreateLinkData, 'icon'>>({
    title: link?.title ?? '',
    link_url: link?.link_url ?? '',
    platform: link?.platform ?? LinkPlatform.FACEBOOK,
    category: link?.category ?? getCategoryByPlatform(LinkPlatform.FACEBOOK)
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateLinkData, string>>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Partial<Record<keyof CreateLinkData, string>> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.link_url.trim()) {
      newErrors.link_url = 'URL is required';
    } else if (!isValidUrl(formData.link_url)) {
      newErrors.link_url = 'Please enter a valid URL';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const payload: CreateLinkData = {
      ...formData,
      category: getCategoryByPlatform(formData.platform),
      icon: `https://imlinkey.store${getPlatformIcon(formData.platform)}`
    };

    await onSubmit(payload);
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleChange = <K extends keyof typeof formData>(
    field: K,
    value: (typeof formData)[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const iconPath = getPlatformIcon(formData.platform);

  return (
    <Card>
      <h2 className="text-xl font-semibold text-white mb-6">
        {link ? 'Edit Link' : 'Create New Link'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Platform"
          value={formData.platform}
          onChange={(value) => handleChange('platform', value as LinkPlatform)}
          options={platformOptions}
        />

        {/* Preview do ícone da plataforma */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">Preview Icon:</span>
          <Image
            src={iconPath}
            alt={`${formData.platform} icon`}
            width={32}
            height={32}
            className="rounded"
          />
        </div>

        <Input
          label="Title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Enter link title"
          error={errors.title}
          required
        />

        <Input
          label="URL"
          value={formData.link_url}
          onChange={(e) => handleChange('link_url', e.target.value)}
          placeholder="https://example.com"
          error={errors.link_url}
          required
        />

        <div className="flex space-x-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Saving...' : (link ? 'Update Link' : 'Create Link')}
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};