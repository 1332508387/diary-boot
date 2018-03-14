package com.lh.diary.controller;

import com.lh.diary.common.util.UserUtil;
import com.lh.diary.common.vo.Select2Result;
import com.lh.diary.common.vo.SysResult;
import com.lh.diary.pojo.ExceptionType;
import com.lh.diary.pojo.User;
import com.lh.diary.service.ExceptionTypeService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;
import java.util.*;

@RequestMapping("/exception/type")
@RestController
public class ExceptionTypeController {
    @Resource
    private ExceptionTypeService exceptionTypeService;

    @RequestMapping("/getTypeNameMap")
    public Map<Long, String> getTypeNameMap(Long erId, HttpSession session) {
        User user = UserUtil.getCurrUser(session);
        List<ExceptionType> exceptionTypes =
                this.exceptionTypeService.listExceptionTypeByUserId(user.getId(), erId);
        Map<Long, String> typeNameMap = new LinkedHashMap<>();
        for (ExceptionType exceptionType : exceptionTypes) {
            typeNameMap.put(exceptionType.getId(), exceptionType.getName());
        }
        return  typeNameMap;
    }

    @RequestMapping("/getTypeNameForSelect2")
    public Select2Result getTypeNameForSelect2(Long erId, HttpSession session) {
        User user = UserUtil.getCurrUser(session);
        List<ExceptionType> exceptionTypes =
                this.exceptionTypeService.listExceptionTypeByUserId(user.getId(), erId);

        Select2Result select2Result = new Select2Result();
        List<Select2Result.ResultData> results = new ArrayList<>();
        Select2Result.ResultData resultData = null;
        for (ExceptionType exceptionType : exceptionTypes) {
            resultData = new Select2Result.ResultData();
            resultData.setId(exceptionType.getId());
            resultData.setText(exceptionType.getName());
            results.add(resultData);
        }
        select2Result.setResults(results);
        return  select2Result;
    }

    @RequestMapping("/save")
    public SysResult save(ExceptionType exceptionType, HttpSession session) {
        try {
            User user = UserUtil.getCurrUser(session);
            exceptionType.setUserId(user.getId());
            exceptionType.setCreated(new Date());
            exceptionType.setUpdated(exceptionType.getCreated());
            this.exceptionTypeService.saveExceptionType(exceptionType);
            return SysResult.build(200, "异常分类添加成功", exceptionType.getId());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return SysResult.build(201, "异常分类添加失败");
    }

    @RequestMapping("/remove/{ids}")
    public SysResult remove(@PathVariable String ids) {
        try {
            if(StringUtils.isNotEmpty(ids)) {
                String[] idArr = ids.split(",");
                for(String id : idArr) {
                    this.exceptionTypeService.removeExceptioTypeById(Long.parseLong(id));
                }
            }
            return SysResult.build(200, "所选分类已删除");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return SysResult.build(201, "分类删除失败");
    }
}
