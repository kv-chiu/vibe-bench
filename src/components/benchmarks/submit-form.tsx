'use client';

import { useActionState } from 'react';
import { submitSolution, type State } from '@/lib/actions/submit';
import { Button } from '@/components/ui/button';
import { Loader2, Send, Upload, X, FileIcon } from 'lucide-react';
import { upload } from '@vercel/blob/client';
import { useState, useRef } from 'react';

const initialState: State = {
  message: '',
  errors: {},
  fields: {},
};

export function SubmitForm({ benchmarkId }: { benchmarkId: string }) {
  const [state, formAction, isPending] = useActionState(submitSolution, initialState);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    setIsUploading(true);

    try {
      const newBlob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });

      setUploadedFiles((prev) => [...prev, newBlob.url]);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed, please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeFile = (urlToRemove: string) => {
    setUploadedFiles((prev) => prev.filter((url) => url !== urlToRemove));
  };

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="benchmarkId" value={benchmarkId} />
      {/* Hidden inputs for uploaded files */}
      {uploadedFiles.map((url) => (
        <input key={url} type="hidden" name="chatLogFiles" value={url} />
      ))}

      {/* Repo URL */}
      <div className="space-y-2">
        <label htmlFor="repoUrl" className="text-sm font-medium text-white">
          Repository URL <span className="text-red-500">*</span>
        </label>
        <input
          id="repoUrl"
          name="repoUrl"
          type="url"
          placeholder="https://github.com/username/project"
          className="bg-surface focus:border-primary/50 w-full rounded-xl border border-white/10 px-4 py-3 text-white transition-colors focus:outline-none"
          required
          defaultValue={state.fields?.repoUrl as string}
        />
        {state.errors?.repoUrl && (
          <p className="mt-1 text-sm text-red-500">{state.errors.repoUrl[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Base Model */}
        <div className="space-y-2">
          <label htmlFor="baseModel" className="text-sm font-medium text-white">
            Base Model <span className="text-red-500">*</span>
          </label>
          <input
            id="baseModel"
            name="baseModel"
            type="text"
            placeholder="e.g. gpt-4-turbo"
            className="bg-surface focus:border-primary/50 w-full rounded-xl border border-white/10 px-4 py-3 text-white transition-colors focus:outline-none"
            required
            defaultValue={state.fields?.baseModel as string}
          />
          {state.errors?.baseModel && (
            <p className="mt-1 text-sm text-red-500">{state.errors.baseModel[0]}</p>
          )}
        </div>

        {/* Coding Tool */}
        <div className="space-y-2">
          <label htmlFor="codingTool" className="text-sm font-medium text-white">
            Coding Tool <span className="text-red-500">*</span>
          </label>
          <input
            id="codingTool"
            name="codingTool"
            type="text"
            placeholder="e.g. Cursor, Windsurf"
            className="bg-surface focus:border-primary/50 w-full rounded-xl border border-white/10 px-4 py-3 text-white transition-colors focus:outline-none"
            required
            defaultValue={state.fields?.codingTool as string}
          />
          {state.errors?.codingTool && (
            <p className="mt-1 text-sm text-red-500">{state.errors.codingTool[0]}</p>
          )}
        </div>
      </div>

      {/* Plugins */}
      <div className="space-y-2">
        <label htmlFor="plugins" className="text-sm font-medium text-white">
          Plugins / Libraries <span className="text-red-500">*</span>
        </label>
        <input
          id="plugins"
          name="plugins"
          type="text"
          placeholder="e.g. pandas, matplotlib (comma separated)"
          className="bg-surface focus:border-primary/50 w-full rounded-xl border border-white/10 px-4 py-3 text-white transition-colors focus:outline-none"
          required
          defaultValue={state.fields?.plugins as string}
        />
        {state.errors?.plugins && (
          <p className="mt-1 text-sm text-red-500">{state.errors.plugins[0]}</p>
        )}
      </div>

      {/* Chat Log Section */}
      <div className="space-y-4 border-t border-white/5 pt-4">
        <label className="block text-sm font-medium text-white">
          Interaction Logs <span className="text-red-500">*</span>
          <span className="text-muted ml-2 text-xs font-normal">
            (Provide at least one: URL, Text, or File)
          </span>
        </label>

        {/* URL Input */}
        <div className="space-y-2">
          <input
            id="chatLogUrl"
            name="chatLogUrl"
            type="url"
            placeholder="Link to Chat Log (URL)"
            className="bg-surface focus:border-primary/50 w-full rounded-xl border border-white/10 px-4 py-3 text-white transition-colors focus:outline-none"
            defaultValue={state.fields?.chatLogUrl as string}
          />
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/5" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background text-muted px-2">OR</span>
          </div>
        </div>

        {/* Text Area */}
        <div className="space-y-2">
          <textarea
            id="chatLogText"
            name="chatLogText"
            placeholder="Paste full chat conversation here..."
            className="bg-surface focus:border-primary/50 list-main h-40 w-full rounded-xl border border-white/10 px-4 py-3 text-white transition-colors focus:outline-none"
            defaultValue={state.fields?.chatLogText as string}
          />
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/5" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background text-muted px-2">OR</span>
          </div>
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`group relative flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200 ${
              isUploading
                ? 'border-primary/50 bg-primary/5'
                : 'bg-surface hover:border-primary/50 border-white/10 hover:bg-white/5'
            } `}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {isUploading ? (
                <Loader2 className="text-primary mb-2 h-8 w-8 animate-spin" />
              ) : (
                <Upload className="text-muted group-hover:text-primary mb-2 h-8 w-8 transition-colors" />
              )}
              <p className="mb-1 text-sm text-gray-400 transition-colors group-hover:text-white">
                <span className="font-semibold">Click to upload</span>
              </p>
              <p className="text-xs text-gray-500">TXT, MD, PDF, JSON, Images (max 50MB)</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept=".txt,.md,.pdf,.json,image/*"
            />
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="mt-3 space-y-2">
              {uploadedFiles.map((url, index) => (
                <div
                  key={index}
                  className="bg-surface animate-in fade-in slide-in-from-top-2 flex items-center justify-between rounded-lg border border-white/10 p-3"
                >
                  <div className="flex items-center overflow-hidden">
                    <div className="mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/5">
                      <FileIcon className="text-primary h-4 w-4" />
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate text-sm text-white hover:underline"
                      >
                        {url.split('/').pop()}
                      </a>
                      <span className="text-muted text-xs">Uploaded</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(url)}
                    className="text-muted rounded-lg p-2 transition-colors hover:bg-red-500/10 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* General Error for Chat Logs */}
        {state.errors?.chatLogUrl && (
          <p className="mt-1 text-sm text-red-500">{state.errors.chatLogUrl[0]}</p>
        )}
      </div>

      {/* Author Name (Optional) */}
      <div className="space-y-2">
        <label htmlFor="authorName" className="text-sm font-medium text-white">
          Author Name
        </label>
        <input
          id="authorName"
          name="authorName"
          type="text"
          placeholder="Your Name (Optional)"
          className="bg-surface focus:border-primary/50 w-full rounded-xl border border-white/10 px-4 py-3 text-white transition-colors focus:outline-none"
          defaultValue={state.fields?.authorName as string}
        />
      </div>

      {/* Author Email (Optional) */}
      <div className="space-y-2">
        <label htmlFor="authorEmail" className="text-sm font-medium text-white">
          Author Email{' '}
          <span className="text-muted-foreground text-xs font-normal">
            (Private, for verification)
          </span>
        </label>
        <input
          id="authorEmail"
          name="authorEmail"
          type="email"
          placeholder="name@example.com"
          className="bg-surface focus:border-primary/50 w-full rounded-xl border border-white/10 px-4 py-3 text-white transition-colors focus:outline-none"
          defaultValue={state.fields?.authorEmail as string}
        />
        {state.errors?.authorEmail && (
          <p className="mt-1 text-sm text-red-500">{state.errors.authorEmail[0]}</p>
        )}
      </div>

      {state.message && (
        <p className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-500">
          {state.message}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Submit Solution
          </>
        )}
      </Button>
    </form>
  );
}
