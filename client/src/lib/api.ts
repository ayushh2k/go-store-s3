const API_URL = 'http://localhost:8080';

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
  const response = await fetch(`http://localhost:8080/files/${fileId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update file');
  }

  return await response.json();
};

export async function fetchUserInfo() {
  try {
    const [emailResponse, filesResponse, storageResponse] = await Promise.all([
      fetchWithAuth('/user/email'),
      fetchWithAuth('/user/total-files'),
      fetchWithAuth('/user/storage-used')
    ]);

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