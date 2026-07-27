import axios from 'axios';
import { baseURL } from '../config';

const authHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});

/**
 * 1. Initialize Multi-Image 3D Project
 * POST /api/project
 */
export const createMultiImageProject = async (token, name = `Project_${Date.now()}`) => {
  const response = await axios.post(
    `${baseURL}/project`,
    { name },
    { headers: authHeaders(token) }
  );

  return response.data;
};

/**
 * 2. Upload Individual Image File for Project
 * POST /api/project/file
 */
export const uploadProjectFile = async ({ projectToken, file, token }) => {
  const formData = new FormData();
  formData.append('token', projectToken);
  formData.append('file', file);

  const response = await axios.post(
    `${baseURL}/project/file`,
    formData,
    {
      headers: {
        ...authHeaders(token),
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
};

/**
 * 3. Complete and Start Multi-Image 3D Generation
 * POST /api/project/complete
 */
export const completeMultiImageProject = async ({ projectToken, token }) => {
  const response = await axios.post(
    `${baseURL}/project/complete`,
    { token: projectToken },
    { headers: authHeaders(token) }
  );

  return response.data;
};
