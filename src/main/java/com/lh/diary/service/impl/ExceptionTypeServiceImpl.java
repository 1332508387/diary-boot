package com.lh.diary.service.impl;

import com.lh.diary.mapper.ExceptionTypeMapper;
import com.lh.diary.pojo.ExceptionType;
import com.lh.diary.service.ExceptionTypeService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service
public class ExceptionTypeServiceImpl implements ExceptionTypeService {
    @Resource
    private ExceptionTypeMapper exceptionTypeMapper;

    public List<ExceptionType> listExceptionTypeByUserId(Long userId, Long erId) {
        ExceptionType exceptionType = new ExceptionType();
        exceptionType.setUserId(userId);
        List<ExceptionType> exceptionTypes = this.exceptionTypeMapper.select(exceptionType);
        //List<ExceptionType> exceptionTypes = this.exceptionTypeMapper.listExceptionTypeByUserId(userId, erId);
        return  exceptionTypes;
    }

    @Override
    public void saveExceptionType(ExceptionType exceptionType) {
        this.exceptionTypeMapper.insertSelective(exceptionType);
    }

    @Override
    public void removeExceptioTypeById(long id) {
        this.exceptionTypeMapper.deleteByPrimaryKey(id);
    }

}
