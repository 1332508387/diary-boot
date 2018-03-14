package com.lh.diary.service;

import com.lh.diary.pojo.ExceptionRecord;

public interface ExceptionRecordService {
    void removeExceptionRecordById(Long id);

    ExceptionRecord getExceptionRecordById(Long id);
}
