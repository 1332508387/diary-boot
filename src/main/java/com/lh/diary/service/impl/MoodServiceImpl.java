package com.lh.diary.service.impl;

import com.lh.diary.mapper.MoodMapper;
import com.lh.diary.pojo.Mood;
import com.lh.diary.pojo.MoodPage;
import com.lh.diary.service.MoodService;
import org.apache.shiro.authz.annotation.RequiresRoles;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

@Service
public class MoodServiceImpl implements MoodService {
    @Resource
    private MoodMapper moodMapper;

    @Override
    public List<Mood> listMood() {
        return this.moodMapper.listMood();
    }

    @Override
    public List<Mood> listMoodByPage(MoodPage moodPage) {
        return this.moodMapper.listMoodByPage(moodPage);
    }

    @Override
    public int count(MoodPage moodPage) {
        return this.moodMapper.count(moodPage);
    }

    @RequiresRoles({"role:0"})
    @Override
    public void saveMood(Mood mood) {
        mood.setCreated(new Date());
        mood.setUpdated(mood.getCreated());
        this.moodMapper.insertSelective(mood);
    }

    @RequiresRoles({"role:0"})
    @Override
    public void updateMood(Mood mood) {
        mood.setUpdated(new Date());
        this.moodMapper.updateByPrimaryKeySelective(mood);
    }

    @RequiresRoles({"role:0"})
    @Override
    public void removeMoodById(Long moodId) {
        Mood mood = new Mood();
        mood.setId(moodId);
        mood.setStatus(-1);
        mood.setUpdated(new Date());
        this.moodMapper.updateByPrimaryKeySelective(mood);
    }
}
