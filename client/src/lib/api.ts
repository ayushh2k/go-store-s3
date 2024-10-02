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

export async function fetchFiles() {
  return fetchWithAuth('/files');
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

export async function searchFiles(query: string) {
  return fetchWithAuth(`/search?q=${encodeURIComponent(query)}`);
}