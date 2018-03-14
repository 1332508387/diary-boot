package com.lh.diary.controller;

import com.lh.diary.common.util.MD5Util;
import com.lh.diary.common.util.UserUtil;
import com.lh.diary.common.vo.SysResult;
import com.lh.diary.pojo.Diary;
import com.lh.diary.pojo.DiaryPwd;
import com.lh.diary.pojo.User;
import com.lh.diary.service.DiaryPwdService;
import com.lh.diary.service.DiaryService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.Date;
import java.util.Objects;

@RequestMapping("/diary")
@RestController
public class DiaryPwdController {
    @Resource
    private DiaryPwdService diaryPwdService;

    @Resource
    private DiaryService diaryService;

    /**
     * 解锁日记，用户输入口令是否正确
     *
     * @param diaryPwd
     * @param request
     * @param session
     * @return
     */
    @PostMapping("/unLock")
    public SysResult unLock(DiaryPwd diaryPwd, HttpServletRequest request, HttpSession session) {
        User currUser = UserUtil.getCurrUser(session);
        DiaryPwd diaryPwd2 = this.diaryPwdService.getDiaryPwdByUId(currUser.getId());
        String reqPwd = diaryPwd.getPassword();
        String salt = diaryPwd2.getSalt();
        String md5ReqPwd = MD5Util.md5(MD5Util.md5(reqPwd) + salt);
        if (Objects.equals(md5ReqPwd, diaryPwd2.getPassword())) {
            return SysResult.ok();
        }
        return SysResult.build(201, null);
    }

    /**
     * 检测用户是否设置了日记密码
     *
     * @param session
     * @return
     */
    @GetMapping("/check/pwd")
    public SysResult checkDiaryPwd(HttpSession session){
        User user = UserUtil.getCurrUser(session);
        return this.diaryPwdService.checkDiaryPwdByUserId(user.getId());
    }

    /**
     * 保存用户日记口令
     *
     * @param diaryPwd
     * @param session
     * @return
     */
    @PostMapping("/pwd/save")
    public SysResult saveDiaryPwd(DiaryPwd diaryPwd, HttpSession session){
        User user = UserUtil.getCurrUser(session);
        diaryPwd.setUserId(user.getId());
        try {
            this.diaryPwdService.saveDiaryPwd(diaryPwd);
            return SysResult.ok();
        } catch (Exception e) {

        }
        return SysResult.build(201, "用户日记口令保存失败");
    }

    /**
     * 修改用户日记口令
     *
     * @param diaryPwd
     * @param oldPwd
     * @param session
     * @return
     */
    @PostMapping("/pwd/update")
    public SysResult updateDiaryPwd(DiaryPwd diaryPwd, String oldPwd, HttpSession session){
        User user = UserUtil.getCurrUser(session);
        diaryPwd.setUserId(user.getId());
        try {
            return this.diaryPwdService.updateDiaryPwd(diaryPwd, oldPwd);
        } catch (Exception e) {

        }
        return SysResult.build(201, "用户日记口令修改失败");
    }

    @GetMapping("/pwd/isLock2")
    public Integer isLock(@DateTimeFormat(pattern = "yyyy-MM-dd") Date writeDate, HttpSession session) {
        User user = UserUtil.getCurrUser(session);
        try {
            Diary diary = new Diary();
            diary.setUserId(user.getId());
            diary.setStatus(null);
            diary.setWriteDate(writeDate);
            Diary diary1 = this.diaryService.getDiary(diary);
            return diary1.getIsLock();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
