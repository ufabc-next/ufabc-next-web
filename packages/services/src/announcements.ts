import { apiCommunications } from "./api";

type AnnouncementsData = {
  courseIdentifier: number;
  season: string;
  text: string;
};

export const Announcements = {
  sendAnnouncement: (data: AnnouncementsData) =>  apiCommunications.post('/groups/announcements', data),
}