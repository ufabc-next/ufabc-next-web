type AnnouncementsData = {
  courseName: string;
  announcementText: string;
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
  const response = {
    status: 201,
  }

  if (response.status === 201) {
    return { success: true, data: data };
  }

  throw new Error('Falha ao enviar o anuncio');
};