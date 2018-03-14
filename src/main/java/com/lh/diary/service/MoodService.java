package com.lh.diary.service;

import com.lh.diary.pojo.Mood;
import com.lh.diary.pojo.MoodPage;
import org.apache.ibatis.annotations.Select;

import java.util.List;

public interface MoodService {
    /**
     * 获取心情列表
     *
     * @param <Mood>
     */
    List<Mood> listMood();

    List<Mood> listMoodByPage(MoodPage moodPage);

    int count(MoodPage moodPage);

    void saveMood(Mood mood);

    void updateMood(Mood mood);

    void removeMoodById(Long moodId);
}
