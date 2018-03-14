package com.lh.diary.service;

import com.lh.diary.common.vo.SysResult;
import com.lh.diary.pojo.DiaryPwd;

public interface DiaryPwdService {
    DiaryPwd getDiaryPwdByUId(Long uid);

    SysResult checkDiaryPwdByUserId(Long id);

    SysResult updateDiaryPwd(DiaryPwd diaryPwd, String oldPwd);

    void saveDiaryPwd(DiaryPwd diaryPwd);
}
