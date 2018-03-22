package com.lh.diary.service.impl;

import com.lh.diary.common.util.MD5Util;
import com.lh.diary.common.util.StringUtil;
import com.lh.diary.common.vo.SysResult;
import com.lh.diary.mapper.DiaryPwdMapper;
import com.lh.diary.pojo.Diary;
import com.lh.diary.pojo.DiaryPwd;
import com.lh.diary.service.DiaryPwdService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

@Service
public class DiaryPwdServiceImpl implements DiaryPwdService {
    @Resource
    private DiaryPwdMapper diaryPwdMapper;

    @Override
    public DiaryPwd getDiaryPwdByUId(Long uid) {
        return this.diaryPwdMapper.getDiaryPwdByUId(uid);
    }

    @Override
    public SysResult checkDiaryPwdByUserId(Long id) {
        DiaryPwd _diaryPwd = new DiaryPwd();
        _diaryPwd.setUserId(id);
        DiaryPwd diaryPwd = this.diaryPwdMapper.selectOne(_diaryPwd);
        if(null == diaryPwd){
            return SysResult.build(0, "用户未设置日记密码");
        }
        return SysResult.build(1, "用户已设置日记密码");
    }

    @Transactional
    @Override
    public SysResult updateDiaryPwd(DiaryPwd diaryPwd, String oldPwd) {
        if(!StringUtils.isNotEmpty(oldPwd)){
            return SysResult.build(201, "原始密码为空");
        }
        DiaryPwd _diaryPwd = new DiaryPwd();
        _diaryPwd.setUserId(diaryPwd.getUserId());
        List<DiaryPwd> diaryPwds = this.diaryPwdMapper.select(_diaryPwd);
        if(diaryPwds.isEmpty()){
            return SysResult.build(201, "");
        }
        _diaryPwd = diaryPwds.get(0);
        String oldPwdMd5 = MD5Util.md5((MD5Util.md5(oldPwd) + _diaryPwd.getSalt()));
        if(!StringUtils.equals(oldPwdMd5, _diaryPwd.getPassword())){
            return SysResult.build(201, "原始密码不正确");
        }

        diaryPwd.setId(_diaryPwd.getId());
        diaryPwd.setUpdated(new Date());
        diaryPwd.setSalt(StringUtil.getRandomString(8));
        String newPwdMd5 = MD5Util.md5((MD5Util.md5(diaryPwd.getPassword()) + diaryPwd.getSalt()));
        diaryPwd.setPassword(newPwdMd5);

        int num = this.diaryPwdMapper.updateByPrimaryKeySelective(diaryPwd);
        if(num <= 0){
            return SysResult.build(201, "");
        }
        return SysResult.ok();
    }

    @Transactional
    @Override
    public void saveDiaryPwd(DiaryPwd diaryPwd) {
        diaryPwd.setCreated(new Date());
        diaryPwd.setUpdated(diaryPwd.getCreated());
        diaryPwd.setSalt(StringUtil.getRandomString(8));
        String newPwd = MD5Util.md5((MD5Util.md5(diaryPwd.getPassword()) + diaryPwd.getSalt()));
        diaryPwd.setPassword(newPwd);
        this.diaryPwdMapper.insertSelective(diaryPwd);
    }
}
