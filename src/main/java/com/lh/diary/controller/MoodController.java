package com.lh.diary.controller;

import com.lh.diary.common.vo.SysResult;
import com.lh.diary.pojo.Mood;
import com.lh.diary.pojo.MoodPage;
import com.lh.diary.service.MoodService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RequestMapping("/mood")
@RestController
public class MoodController {
    @Resource
    private MoodService moodService;

    @GetMapping("/getData")
    public Map<String, Object> listMood(MoodPage moodPage) {
        Map<String, Object> moodMap = new LinkedHashMap<>();
        List<Mood> moodList = this.moodService.listMoodByPage(moodPage);
        int count = this.moodService.count(moodPage);
        moodMap.put("data", moodList);
        moodMap.put("recordsTotal", count);
        moodMap.put("recordsFiltered", count);
        return moodMap;
    }

    @PostMapping("/save")
    public SysResult saveMood(Mood mood, HttpSession session){
        this.moodService.saveMood(mood);
        return SysResult.build(200, "心情保存成功！");
    }

    @PostMapping("/update")
    public SysResult updateMood(Mood mood, HttpSession session) {
        /*User currUser = UserUtil.getCurrUser(session);
        if (currUser == null || currUser.getType() != 0) {
            return SysResult.build(201, "操作失败，没有权限");
        }*/
        this.moodService.updateMood(mood);
        return  SysResult.build(200, "心情修改成功！");
    }

    @DeleteMapping("/del/{moodId}")
    public SysResult remove(@PathVariable Long moodId) {
        this.moodService.removeMoodById(moodId);
        return SysResult.build(200, "删除成功！");
    }

    /**
     * 用于 <select> 标签显示
     *
     * @return
     */
    @GetMapping("/getMoodMap")
    public Map<String, String> getMoodMap() {
        Map<String, String> moodMap = new LinkedHashMap<>();
        List<Mood> moodList = this.moodService.listMood();
        for (Mood mood : moodList) {
            moodMap.put(mood.getId() + "", mood.getName());
        }
        return moodMap;
    }

    /**
     * 用于前端页面心情下拉列表显示（Ajax请求）
     */
    @RequestMapping(value = "/getMoodIdAndName", method = RequestMethod.GET)
    public Map<Long, String> getMoodIdAndName(){
        Map<Long, String> result = new HashMap<>();
        List<Mood> moods = this.moodService.listMood();
        for (Mood mood : moods) {
            result.put(mood.getId(), mood.getName());
        }
        return result;
    }
}
