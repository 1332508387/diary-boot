package com.lh.diary.service.impl;

import com.lh.diary.mapper.ExceptionRecordMapper;
import com.lh.diary.mapper.ExceptionTypeMapper;
import com.lh.diary.pojo.ExceptionRecord;
import com.lh.diary.pojo.ExceptionType;
import com.lh.diary.service.ExceptionRecordService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

@Service
public class ExceptionRecordServiceImpl implements ExceptionRecordService {
    @Resource
    private ExceptionRecordMapper exceptionRecordMapper;
    @Resource
    private ExceptionTypeMapper exceptionTypeMapper;

    public List<ExceptionRecord> listExceptionRecord(Long userId, Integer pageIndex, Integer pageSize, List<Long> keywords) {
        List<ExceptionRecord> exceptionRecords = this.exceptionRecordMapper.listExceptionRecord(userId, pageIndex, pageSize, keywords);
        return exceptionRecords;
    }

    public Integer countByUserId(Long userId, List<Long> keywords) {
        return this.exceptionRecordMapper.countByUserId(userId,keywords);
    }

    public void saveERIdAndETId(Long exceptionRecordId, Long exceptionTypeId) {
        this.exceptionRecordMapper.saveERIdAndETId(exceptionRecordId, exceptionTypeId);
    }

    public void saveExceptionRecord(ExceptionRecord exceptionRecord, String[] exceptionTypeIds) {
        // 保存异常信息
        exceptionRecord.setCreated(new Date());
        exceptionRecord.setUpdated(exceptionRecord.getCreated());
        this.exceptionRecordMapper.insertSelective(exceptionRecord);

        // 保存关联的分类信息
        if(exceptionTypeIds == null || exceptionTypeIds.length == 0 ) return;

        for (String exceptionTypeId : exceptionTypeIds) {
            Long typeId = null;
            // 如果当前不是数字，则无此分类，保存此分类信息，并获取返回的分类 ID
            if(!StringUtils.isNumeric(exceptionTypeId)) {
                ExceptionType exceptionType = new ExceptionType();
                exceptionType.setUserId(exceptionRecord.getUserId());
                exceptionType.setName(exceptionTypeId);
                exceptionType.setCreated(exceptionRecord.getCreated());
                exceptionType.setUpdated(exceptionRecord.getCreated());
                this.exceptionTypeMapper.insertSelective(exceptionType);
                typeId = exceptionType.getId();
            } else {    // 当前值是数字，则已有此分类，获取此分类 ID
                typeId = Long.parseLong(exceptionTypeId);
            }
            // 保存 exceptionRecord - exceptionType 关联关系
            if(typeId != null){
                this.saveERIdAndETId(exceptionRecord.getId(), typeId);
            }
        }
    }

    public void updateExceptionRecord(ExceptionRecord exceptionRecord, String[] exceptionTypeIds) {
        // 更新异常信息
        exceptionRecord.setUpdated(new Date());
        this.exceptionRecordMapper.updateByPrimaryKeySelective(exceptionRecord);

        // 更新分类信息（先删除原有异常信息和分类的关联）
        this.exceptionRecordMapper.removeERIdAndETId(exceptionRecord.getId());

        if(exceptionTypeIds == null || exceptionTypeIds.length == 0) return;
        for(String exceptionTypeid : exceptionTypeIds) {
            // 当前分类 ID 不是一个数字（即是字符串），则为新分类
            Long typeId = null;
            if(!StringUtils.isNumeric(exceptionTypeid)) {
                ExceptionType exceptionType = new ExceptionType();
                exceptionType.setUserId(exceptionRecord.getUserId());
                exceptionType.setName(exceptionTypeid);
                exceptionType.setCreated(new Date());
                exceptionType.setUpdated(exceptionType.getCreated());
                this.exceptionTypeMapper.insertSelective(exceptionType);
                typeId = exceptionType.getId();
            } else {    // 当前 ID 是一个数字，则此分类已存在
                typeId = Long.parseLong(exceptionTypeid);
            }
            // 保存 ExceptionRecord 和 ExceptionType 的关联关系
            if(typeId != null) {
                this.exceptionRecordMapper.saveERIdAndETId(exceptionRecord.getId(), typeId);
            }
        }

    }

    @Override
    public void removeExceptionRecordById(Long id) {
        this.exceptionRecordMapper.deleteByPrimaryKey(id);
    }

    @Override
    public ExceptionRecord getExceptionRecordById(Long id) {
        return this.exceptionRecordMapper.selectByPrimaryKey(id);
    }
}
