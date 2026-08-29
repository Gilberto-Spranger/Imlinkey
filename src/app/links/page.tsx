'use client';

import { useState, useEffect } from 'react';
import { Link, CreateLinkData } from '@/types';
import { apiClient } from '@/utils';
import { LinkList } from '@/components/links/linkList';
import { LinkForm } from '@/components/links/linkForm';
import { Button, Card, LoadingPage } from "@/components/ui";
import useAuthRedirect from "@/hooks/use-auth-redirect";

type ViewMode = 'list' | 'create' | 'edit';

export default function Links() {
  const [links, setLinks] = useState<Link[]>([]);
  const [currentLink, setCurrentLink] = useState<Link | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const loadingAuth = useAuthRedirect();

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    try {
      setIsLoading(true);
      const fetchedLinks = await apiClient.getLinks();
      setLinks(fetchedLinks);
      setError('');
    } catch (err) {
      setError('Failed to load links');
      console.error('Error loading links:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateLink = async (data: CreateLinkData) => {
    try {
      setIsSubmitting(true);
      const newLink = await apiClient.createLink(data);
      setLinks(prev => [newLink, ...prev]);
      setViewMode('list');
      setError('');
    } catch (err) {
      setError('Failed to create link');
      console.error('Error creating link:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateLink = async (data: CreateLinkData) => {
    if (!currentLink) return;

    try {
      setIsSubmitting(true);
      const updatedLink = await apiClient.updateLink(currentLink.id, data);
      setLinks(prev => prev.map(link => 
        link.id === currentLink.id ? updatedLink : link
      ));
      setViewMode('list');
      setCurrentLink(null);
      setError('');
    } catch (err) {
      setError('Failed to update link');
      console.error('Error updating link:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
      await apiClient.deleteLink(id);
      setLinks(prev => prev.filter(link => link.id !== id));
      setError('');
    } catch (err) {
      setError('Failed to delete link');
      console.error('Error deleting link:', err);
    }
  };

  const handleEditLink = (link: Link) => {
    setCurrentLink(link);
    setViewMode('edit');
  };

  const handleCancel = () => {
    setViewMode('list');
    setCurrentLink(null);
  };

  if (isLoading || loadingAuth) return <LoadingPage/>;

  return (
    <div className="min-h-screen bg-[#020617] py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Links</h1>
          <p className="text-gray-400">Manage your social links and profiles</p>
        </div>

        {error && (
          <Card className="mb-6 border-red-500 bg-red-900/20">
            <p className="text-red-400 text-center">{error}</p>
          </Card>
        )}

        {viewMode === 'list' ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-white">
                  Your Links ({links.length})
                </h2>
              </div>
              <Button
                variant="primary"
                onClick={() => setViewMode('create')}
              >
                Add New Link
              </Button>
            </div>

            <LinkList
              links={links}
              onEdit={handleEditLink}
              onDelete={handleDeleteLink}
            />
          </>
        ) : (
          <LinkForm
            link={currentLink || undefined}
            onSubmit={currentLink ? handleUpdateLink : handleCreateLink}
            onCancel={handleCancel}
            isLoading={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}
