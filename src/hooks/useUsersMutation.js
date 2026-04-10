import authenticatedApi, { getAxiosErrorMessage } from '@/api/axiosInstance';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useAddUser = () => {
  const queryClient = useQueryClient();

  const addUser = async (data) => {
    console.log(data);
    const response = await authenticatedApi.post(`/users`, data);
    if (response.status !== 201) {
      throw new Error('Failed to add user');
    }
    return response.data;
  };

  return useMutation({
    mutationFn: (data) => addUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries('users');
      toast.success('User added successfully');
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error) || 'Failed to add user';
      console.error('Error adding a user:', message);
      toast.error(message);
    },
  });
};

export const useActivateUser = () => {
  const queryClient = useQueryClient();

  const activateUser = async (data) => {
    // data should contain: { id, adminPassword }
    const response = await authenticatedApi.patch(`/users/${data.id}/reactivate-account`, {
      adminPassword: data.adminPassword
    });
    if (response.status !== 200) {
      throw new Error('Failed to activate user');
    }
    return response.data;
  };

  return useMutation({
    mutationFn: (data) => activateUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('User activated successfully');
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error) || 'Failed to activate user';
      console.error('Error activating user:', message);
      toast.error(message);
    },
  });
};

export const useDeactivateUser = () => {
  const queryClient = useQueryClient();

  const deactivateUser = async (data) => {
    // data should contain: { id, adminPassword }
    const response = await authenticatedApi.patch(`/users/${data.id}/deactivate-account`, {
      adminPassword: data.adminPassword
    });
    if (response.status !== 200) {
      throw new Error('Failed to deactivate user');
    }
    return response.data;
  };

  return useMutation({
    mutationFn: (data) => deactivateUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('User deactivated successfully');
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error) || 'Failed to deactivate user';
      console.error('Error deactivating user:', message);
      toast.error(message);
    },
  });
};
/* =========================================
   UPDATE USER
========================================= */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  const updateUser = async (data) => {
    const response = await authenticatedApi.patch(
      `/users/${data.id}/update`,
      data
    );

    if (response.status !== 200) {
      throw new Error('Failed to update user');
    }

    return response.data;
  };

  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('User updated successfully');
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error) || 'Failed to update user';
      toast.error(message);
    },
  });
};

/* =========================================
   DELETE USER
========================================= */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  const deleteUser = async (id) => {
    const response = await authenticatedApi.delete(`/users/${id}`);

    if (response.status !== 200) {
      throw new Error('Failed to delete user');
    }

    return response.data;
  };

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('User deleted successfully');
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error) || 'Failed to delete user';
      toast.error(message);
    },
  });
};

/* =========================================
   REACTIVATE USER
========================================= */
export const useReactivateUser = () => {
  const queryClient = useQueryClient();

  const reactivateUser = async (data) => {
    // data should contain: { id, adminPassword }
    const response = await authenticatedApi.patch(`/users/${data.id}/reactivate-account`, {
      adminPassword: data.adminPassword
    });
    if (response.status !== 200) {
      throw new Error("Failed to reactivate user");
    }
    return response.data;
  };

  return useMutation({
    mutationFn: reactivateUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["users"]);
      toast.success(data.message || "User reactivated successfully");
    },
    onError: (error) => {
      const message = getAxiosErrorMessage(error) || "Failed to reactivate user";
      toast.error(message);
      console.error("Error reactivating user:", message);
    },
  });
};
