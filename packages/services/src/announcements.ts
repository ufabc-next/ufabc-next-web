import { api } from './api';

type AnnouncementsData = {
  courseIdentifier: number;
  season: string;
  text: string;
};

export const Announcements = {
  sendAnnouncement: (data: AnnouncementsData) =>
    api.post('/v2/announcement', data),
};
