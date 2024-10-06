// src/lib/api.ts

const API_URL = process.env.API_URL || 'http://localhost:8080';

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
  };

  const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  if (!response.ok) {
    throw new Error('API request failed');
  }
  return response.json();
}

export async function fetchFiles(url = `${API_URL}/files`) {
  return fetchWithAuth(url.replace(API_URL, ''));
}

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return fetchWithAuth('/upload', { method: 'POST', body: formData });
}

export async function deleteFile(fileId: string) {
  return fetchWithAuth(`/files/${fileId}`, { method: 'DELETE' });
}

export async function shareFile(fileId: string) {
  return fetchWithAuth(`/share/${fileId}`);
}

export async function searchFiles(fileName: string, uploadedAt: string, contentType: string) {
  const searchParams = new URLSearchParams();
  if (fileName) searchParams.append('file_name', fileName);
  if (uploadedAt) searchParams.append('uploaded_at', uploadedAt);
  if (contentType && contentType !== 'all') searchParams.append('content_type', contentType);
  
  const searchUrl = `/search?${searchParams.toString()}`;
  return fetchWithAuth(searchUrl);
}

export const updateFile = async (fileId: string, data: { file_name: string }) => {
  return fetchWithAuth(`/files/${fileId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export async function fetchUserInfo() {
  try {
    const emailResponse = await fetchWithAuth('/user/email');
    let filesResponse = { total_files: 0 };
    let storageResponse = { storage_used: 0 };

    try {
      filesResponse = await fetchWithAuth('/user/total-files');
    } catch (_) {
      console.warn('Failed to fetch total files, defaulting to 0');
    }

    try {
      storageResponse = await fetchWithAuth('/user/storage-used');
    } catch (_) {
      console.warn('Failed to fetch storage used, defaulting to 0');
    }

    return {
      email: emailResponse.email,
      totalFiles: filesResponse.total_files,
      storageUsed: storageResponse.storage_used,
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}