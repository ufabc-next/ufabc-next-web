import { apiCommunications } from "./api";

type AnnouncementsData = {
  courseIdentifier: number;
  text: string;
};

type AnnouncementsResult = {
  success: boolean;
  id?: string;
  data?: AnnouncementsData;
  url?: string;
};

export const sendAnnouncement = async (
  data: AnnouncementsData,
): Promise<AnnouncementsResult> => {
  const response = await apiCommunications.post('/announcements', data);

  return response.data
};
