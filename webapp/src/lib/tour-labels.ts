import type { Destination, TourAudience, TourStatus } from "@/generated/prisma/enums";

export const DESTINATION_LABELS: Record<Destination, string> = {
  ZHANGJIAJIE: "Чжанцзяцзе",
  CHONGQING: "Чунцин",
  XIAN: "Сиань",
  SHANGHAI: "Шанхай",
  GUANGZHOU: "Гуанчжоу",
  HONGKONG: "Гонконг",
  CHENGDU: "Чэнду",
};

export const AUDIENCE_LABELS: Record<TourAudience, string> = {
  GROUP: "Топтық",
  PRIVATE: "Жеке",
  BOTH: "Топтық және жеке",
};

export const TOUR_STATUS_LABELS: Record<TourStatus, string> = {
  DRAFT: "Жоба",
  PUBLISHED: "Жарияланды",
  ARCHIVED: "Мұрағатта",
};
