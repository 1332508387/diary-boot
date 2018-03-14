package com.lh.diary.controller;

import com.lh.diary.common.util.UserUtil;
import com.lh.diary.common.vo.SysResult;
import com.lh.diary.pojo.Diary;
import com.lh.diary.pojo.DiaryContent;
import com.lh.diary.pojo.DiaryPage;
import com.lh.diary.pojo.User;
import com.lh.diary.service.DiaryService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequestMapping("/diary")
@RestController
public class DiaryController extends DateController {
    @Resource
    private DiaryService diaryService;

    /**
     * 分页获取日记列表
     *
     * @param diaryPage
     * @return
     */
    @GetMapping("/list")
    public Map<String, Object> listDiary(DiaryPage diaryPage, HttpServletRequest request, HttpSession session) {
        Map<String, Object> diaryMap = new HashMap<>();
        User currUser = UserUtil.getCurrUser(session);
        List<Diary> diaryList = this.diaryService.listDiary(diaryPage, currUser);
        int count = this.diaryService.count(diaryPage, currUser);
        diaryMap.put("data", diaryList);
        diaryMap.put("recordsTotal", count);
        diaryMap.put("recordsFiltered", count);
        return diaryMap;
    }

    /**
     * 保存日记信息
     */
    @PostMapping("/save")
    public SysResult saveDiary(Diary diary, String content, HttpServletRequest request, HttpSession session) {
        User user = UserUtil.getCurrUser(session);
        diary.setUserId(user.getId());
        DiaryContent diaryContent = new DiaryContent();
        diaryContent.setContent(content);
        return this.diaryService.saveDiary(diary, diaryContent);
    }

    @GetMapping("/pwd/isLock/{diaryId}")
    public int isLock(@PathVariable Long diaryId) {
        List<Diary> diaryList = this.diaryService.getDiaryById(diaryId);
        if (diaryList.isEmpty()) {
            return -1;
        }
        return diaryList.get(0).getIsLock();
    }

    /**
     * 删除指定 ID 的日记信息
     *
     * @param diaryId
     * @return
     */
    @DeleteMapping("/del/{diaryId}")
    public SysResult removeDiary(@PathVariable Long diaryId) {
        this.diaryService.removeDiary(diaryId);
        return SysResult.ok();
    }

    @PostMapping("/update")
    public SysResult updateDiary(Diary diary, String content) {
        DiaryContent dc = new DiaryContent();
        dc.setContent(content);
        this.diaryService.updateDiary(diary, dc);
        return SysResult.ok();
    }

    @GetMapping("/getDiary/{diaryId}")
    public SysResult getDiary(@PathVariable Long diaryId) {
        List<Diary> diaryList = this.diaryService.getDiaryById(diaryId);
        Diary diary = diaryList.get(0);
        return SysResult.ok(diary);
    }
}
