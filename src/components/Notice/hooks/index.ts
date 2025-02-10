import { getNotices, markAsRead } from "@/services/api/notification";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";

export const useGetListNotification = ({ page, limit }: any) => {
  const listNotificationt = useInfiniteQuery({
    queryKey: ["getNotification", page],
    queryFn: async ({ pageParam = page }) => {
      const response = await getNotices({ page: pageParam, limit });
      return response;
    },
    initialPageParam: 1,
    enabled: !!page,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.nextPage ?? false;
    },
  });

  return {
    listNotificationtHasNextPage: listNotificationt.hasNextPage,
    listFetchNextPage: listNotificationt.fetchNextPage,
    isSuccess: listNotificationt.isSuccess,
    data: listNotificationt.data,
    refetch: listNotificationt.refetch,
  };
};

type NotificationProps = {
  onSusscessClickNotification: (value: any) => void;
};

export const useSetMarkAsRead = ({
  onSusscessClickNotification,
}: NotificationProps) => {
  const handleSetMarkAsRead = useMutation({
    mutationFn: async (param: any) => {
      try {
        const response = await markAsRead(param?._id);
        return response;
      } catch (error) {
        throw error;
      }
    },
    onError: (error, variables, context) => {},
    onSuccess: (data, variables, context) => {
      onSusscessClickNotification(data);
    },
    onSettled: (data, error, variables, context) => {},
  });

  return {
    loading: handleSetMarkAsRead.isPending,
    onSetMarkAsRead: handleSetMarkAsRead.mutate,
  };
};
