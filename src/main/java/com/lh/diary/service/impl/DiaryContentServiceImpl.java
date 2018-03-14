package com.lh.diary.service.impl;

import com.lh.diary.mapper.DiaryContentMapper;
import com.lh.diary.pojo.DiaryContent;
import com.lh.diary.service.DiaryContentService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Service
public class DiaryContentServiceImpl implements DiaryContentService {
    @Resource
    private DiaryContentMapper diaryContentMapper;

    @Override
    public DiaryContent getDiaryContentById(Long diaryId) {
        return this.diaryContentMapper.getDiaryContentById(diaryId);
    }
}
