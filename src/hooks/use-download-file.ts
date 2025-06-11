import React from 'react';

import { useAlertContext } from '~/store/contexts';

export default function useViewDownloadFile({
  fileName = 'download',
  url: fileUrl,
  token,
}: {
  fileName?: string;
  url: string;
  token: string;
}) {
  const alert = useAlertContext();

  const [downloading, setDownloading] = React.useState(false);
  const [viewLoading, setViewLoading] = React.useState(false);

  const downloadFile = React.useCallback(async () => {
    try {
      setDownloading(true);
      const response = await fetch(fileUrl, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });

      if (!response.ok) {
        throw new Error('Error Getting Document');
      }

      // Convert response to Blob
      const blob = await response.blob();

      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);

      // Create an anchor element and trigger a download
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert.open({
        type: 'error',
        message: (error as any).message || 'Error Downloading Document',
      });
    } finally {
      setDownloading(false);
    }
  }, [alert, token, fileUrl, fileName]);

  const viewFile = React.useCallback(async () => {
    try {
      setViewLoading(true);
      const response = await fetch(fileUrl, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
        },
      });

      if (!response.ok) {
        throw new Error('Error Getting Document');
      }

      const blob = await response.blob();

      const url = URL.createObjectURL(blob);

      window.open(url, '_blank');
    } catch (error) {
      alert.open({
        type: 'error',
        message: (error as any).message || 'Error Viewing Document',
      });
    } finally {
      setViewLoading(false);
    }
  }, [alert, token, fileUrl]);

  return { view: viewFile, download: downloadFile, downloading, viewLoading };
}

export function useExternalViewDownloadFile({ token }: { token: string }) {
  const alert = useAlertContext();

  const [downloading, setDownloading] = React.useState(false);
  const [viewLoading, setViewLoading] = React.useState(false);

  const downloadFile = React.useCallback(
    async (fileUrl: string, fileName: string = 'File') => {
      try {
        setDownloading(true);
        const response = await fetch(fileUrl, {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + token,
          },
        });

        if (!response.ok) {
          throw new Error('Error Getting Document');
        }

        // Convert response to Blob
        const blob = await response.blob();

        // Create a URL for the Blob
        const url = URL.createObjectURL(blob);

        // Create an anchor element and trigger a download
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();

        // Cleanup
        link.remove();
        URL.revokeObjectURL(url);
      } catch (error) {
        alert.open({
          type: 'error',
          message: (error as any).message || 'Error Viewing Document',
        });
      } finally {
        setDownloading(false);
      }
    },
    [alert, token]
  );

  const viewFile = React.useCallback(
    async (fileUrl: string) => {
      try {
        setViewLoading(true);
        const response = await fetch(fileUrl, {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + token,
          },
        });

        if (!response.ok) {
          throw new Error('Error Getting Document');
        }

        const blob = await response.blob();

        const url = URL.createObjectURL(blob);

        window.open(url, '_blank');
      } catch (error) {
        alert.open({
          type: 'error',
          message: (error as any).message || 'Error Viewing Document',
        });
      } finally {
        setViewLoading(false);
      }
    },
    [alert, token]
  );

  return { view: viewFile, download: downloadFile, downloading, viewLoading };
}