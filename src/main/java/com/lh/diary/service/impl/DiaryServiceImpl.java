package com.lh.diary.service.impl;

import com.lh.diary.common.DateFormatContant;
import com.lh.diary.common.util.DateUtil;
import com.lh.diary.common.vo.SysResult;
import com.lh.diary.mapper.DiaryContentMapper;
import com.lh.diary.mapper.DiaryMapper;
import com.lh.diary.pojo.Diary;
import com.lh.diary.pojo.DiaryContent;
import com.lh.diary.pojo.DiaryPage;
import com.lh.diary.pojo.User;
import com.lh.diary.service.DiaryService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class DiaryServiceImpl implements DiaryService {
    @Resource
    private DiaryMapper diaryMapper;

    @Resource
    private DiaryContentMapper diaryContentMapper;

    @Override
    public SysResult saveDiary(Diary diary, DiaryContent content) {
        /*// 0 - 正常
        diary.setStatus(0);
        // 0 - 未锁定
        diary.setIsLock(0);
        diary.setCreated(new Date());
        diary.setUpdated(diary.getCreated());
        this.diaryMapper.saveDiary(diary);

        // 保存日记内容
        Long id = diary.getId();
        if (id != null) {
            content.setDiaryId(id);
            content.setCreated(diary.getCreated());
            content.setUpdated(diary.getCreated());
            this.diaryContentMapper.saveContent(content);
        }*/
        // 判断用户日记是否重复
        Diary _diary = new Diary();
        _diary.setUserId(diary.getUserId());
        _diary.setWriteDate(diary.getWriteDate());
        _diary.setStatus(null);
        List<Diary> diarys = this.diaryMapper.queryDiaryByWrite(_diary);
        if (!diarys.isEmpty()) {
            return SysResult.build(201, "日记已存在，请修改写作日期");
        }

        // 保存日记信息
        diary.setCreated(new Date());
        diary.setUpdated(diary.getCreated());

        diary.setStatus(0);
        if (!StringUtils.equals(DateUtil.getDate(DateFormatContant.FORMAT2),
                DateUtil.getDate(diary.getWriteDate(), DateFormatContant.FORMAT2))) {
            // 设置补写状态
            diary.setStatus(1);
        }
        this.diaryMapper.insertSelective(diary);

        // 保存日记内容
        content.setDiaryId(diary.getId());
        content.setCreated(diary.getCreated());
        content.setUpdated(diary.getCreated());
        int num = this.diaryContentMapper.insertSelective(content);
        if (num <= 0) {
            return SysResult.build(201, "日记保存失败");
        }
        return SysResult.build(200, "日记保存成功");
    }

    @Override
    public List<Diary> listDiary(DiaryPage diaryPage, User currUser) {
        List<Diary> diaryList = this.diaryMapper.listDiary(diaryPage, currUser);
        return diaryList;
    }

    @Override
    public int count(DiaryPage diaryPage, User currUser) {
        int count = this.diaryMapper.count(diaryPage, currUser);
        return count;
    }

    @Override
    public List<Diary> getDiaryById(Long id) {
        List<Diary> diaryList = new ArrayList<>();
        diaryList.add(this.diaryMapper.getDiaryById(id));
        return diaryList;
    }

    @Override
    public void removeDiary(Long diaryId) {
        this.diaryMapper.updateDiaryStatus(diaryId, -1);
    }

    @Override
    public void updateDiary(Diary diary, DiaryContent content) {
        diary.setUpdated(new Date());
        // this.diaryMapper.updateDiary(diary);
        this.diaryMapper.updateByPrimaryKeySelective(diary);

        content.setDiaryId(diary.getId());
        content.setUpdated(diary.getUpdated());
        // this.diaryContentMapper.updateContent(content);
        this.diaryContentMapper.updateByPrimaryKeySelective(content);
    }

    @Override
    public Diary getDiary(Diary diary) {
        return this.diaryMapper.selectOne(diary);
    }

    @Override
    public List<Diary> getDiaryByScore(Long uId) {
        return this.diaryMapper.getDiaryByScore(uId);
    }

}
