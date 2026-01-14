'use client';

import { useState } from 'react';
import { Download, Image as ImageIcon } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/Tabs';

interface BeforeAfterPreviewProps {
  beforeUrl: string | null;
  afterUrl: string | null;
  onDownload?: () => void;
  isProcessing?: boolean;
}

export function BeforeAfterPreview({ beforeUrl, afterUrl, onDownload, isProcessing }: BeforeAfterPreviewProps) {
  const [activeTab, setActiveTab] = useState<'before' | 'after'>('after');

  if (isProcessing) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-sm text-gray-600">Working on it...</p>
        </div>
      </div>
    );
  }

  if (!afterUrl) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <div className="flex flex-col items-center justify-center py-12 space-y-3">
          <div className="rounded-full bg-gray-100 p-4">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-900">No enhancement yet</p>
          <p className="text-xs text-gray-600 text-center max-w-xs">
            Upload an image and click "Enhance Photo" to see the result here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Preview</h3>
        <p className="text-xs text-gray-600">PNG • 1K Resolution</p>
      </div>

      {/* Mobile: Tabs */}
      <div className="block md:hidden mb-4">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'before' | 'after')}>
          <TabsList className="w-full">
            <TabsTrigger value="before" className="flex-1">Before</TabsTrigger>
            <TabsTrigger value="after" className="flex-1">After</TabsTrigger>
          </TabsList>
          <TabsContent value="before" className="mt-4">
            {beforeUrl && (
              <img
                src={beforeUrl}
                alt="Before"
                className="w-full rounded-lg object-contain max-h-[400px]"
              />
            )}
          </TabsContent>
          <TabsContent value="after" className="mt-4">
            <img
              src={afterUrl}
              alt="After"
              className="w-full rounded-lg object-contain max-h-[400px]"
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Desktop: Side by side */}
      <div className="hidden md:grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs font-medium text-gray-600 mb-2">Before</p>
          {beforeUrl && (
            <img
              src={beforeUrl}
              alt="Before"
              className="w-full rounded-lg object-contain max-h-[500px] border border-gray-200"
            />
          )}
        </div>
        <div>
          <p className="text-xs font-medium text-gray-600 mb-2">After</p>
          <img
            src={afterUrl}
            alt="After"
            className="w-full rounded-lg object-contain max-h-[500px] border border-gray-200"
          />
        </div>
      </div>

      {onDownload && (
        <button
          onClick={onDownload}
          className="w-full btn btn-primary flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download Enhanced Image
        </button>
      )}
    </div>
  );
}
