package com.lh.diary.service.impl;

import com.alibaba.fastjson.JSON;
import com.lh.diary.mapper.MoodMapper;
import com.lh.diary.pojo.Diary;
import com.lh.diary.pojo.Mood;
import com.lh.diary.pojo.MoodPage;
import com.lh.diary.service.MoodService;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.authz.annotation.RequiresRoles;
import org.springframework.data.redis.RedisConnectionFailureException;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

@Service
public class MoodServiceImpl implements MoodService {
    public static final String DIARY_REDIS_MOOD_KEY = "DIARY_REDIS_MOOD_KEY";

    @Resource
    private MoodMapper moodMapper;

    @Resource
    private StringRedisTemplate stringRedisTemplate;

    @Override
    public List<Mood> listMood() {
        List<Mood> moods = null;

        try {
            // 从 Redis 获取 mood JSON
            String moodJsonStr = stringRedisTemplate.opsForValue().get(DIARY_REDIS_MOOD_KEY);
            // Redis 中不存在，从数据库获取，并将其存入 Redis
            if (StringUtils.isEmpty(moodJsonStr)) {
                moods = this.moodMapper.listMood();
                moodJsonStr = JSON.toJSONString(moods);
                stringRedisTemplate.opsForValue().set(DIARY_REDIS_MOOD_KEY, moodJsonStr);
            } else {
                // Redis 存在，进行转化
                moods = JSON.parseArray(moodJsonStr, Mood.class);
            }
        } catch (RedisConnectionFailureException rcfe) {
            // Redis 连接失败，从数据库获取
            moods = this.moodMapper.listMood();
        }

        return moods;
    }

    @Override
    public List<Mood> listMoodByPage(MoodPage moodPage) {
        return this.moodMapper.listMoodByPage(moodPage);
    }

    @Override
    public int count(MoodPage moodPage) {
        return this.moodMapper.count(moodPage);
    }

    @Transactional
    @RequiresRoles({"role:0"})
    @Override
    public void saveMood(Mood mood) {
        mood.setCreated(new Date());
        mood.setUpdated(mood.getCreated());
        this.moodMapper.insertSelective(mood);
        // 从 Redis 删除 mood 信息
        stringRedisTemplate.delete(DIARY_REDIS_MOOD_KEY);
    }

    @Transactional
    @RequiresRoles({"role:0"})
    @Override
    public void updateMood(Mood mood) {
        mood.setUpdated(new Date());
        this.moodMapper.updateByPrimaryKeySelective(mood);
        // 从 Redis 删除 mood 信息
        stringRedisTemplate.delete(DIARY_REDIS_MOOD_KEY);
    }

    @Transactional
    @RequiresRoles({"role:0"})
    @Override
    public void removeMoodById(Long moodId) {
        Mood mood = new Mood();
        mood.setId(moodId);
        mood.setStatus(-1);
        mood.setUpdated(new Date());
        this.moodMapper.updateByPrimaryKeySelective(mood);
        // 从 Redis 删除 mood 信息
        stringRedisTemplate.delete(DIARY_REDIS_MOOD_KEY);
    }
}
