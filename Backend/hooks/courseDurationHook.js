// Hook → auto-runs on DB changes

import Course from "../models/courseModel.js";
import Lecture from "../models/lectureModel.js";
import Chapter from "../models/chapterModel.js";

export const calculateCourseDuration = async (courseId) => {
  const lectures = await Lecture.findAll({
    where: { courseId },
    include: [{ model: Chapter }],
  });

  let courseTotalMinutes = 0;

  for (const lecture of lectures) {
    let chaptersSum = 0;

    if (lecture.Chapters.length > 0) {
      for (const chapter of lecture.Chapters) {
        const h = Number(chapter.durationHours) || 0;
        const m = Number(chapter.durationMinutes) || 0;
        const total = Math.max(0, h * 60 + m);

        chapter.totalMinutes = total;
        await chapter.save();

        chaptersSum += total;
      }

      lecture.totalMinutes = chaptersSum;
    } else {
      const h = Number(lecture.durationHours) || 0;
      const m = Number(lecture.durationMinutes) || 0;
      lecture.totalMinutes = Math.max(0, h * 60 + m);
    }

    lecture.durationHours = Math.floor(lecture.totalMinutes / 60);
    lecture.durationMinutes = lecture.totalMinutes % 60;

    await lecture.save();
    courseTotalMinutes += lecture.totalMinutes;
  }

  await Course.update(
    {
      totalDurationHours: Math.floor(courseTotalMinutes / 60),
      totalDurationMinutes: courseTotalMinutes % 60,
      totalLectures: lectures.length,
    },
    { where: { id: courseId } }
  );
};
