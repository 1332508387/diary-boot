package com.lh.diary.mapper;

import com.lh.diary.common.MyMapper;
import com.lh.diary.pojo.ExceptionRecord;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ExceptionRecordMapper extends MyMapper<ExceptionRecord> {
    List<ExceptionRecord> listExceptionRecord(@Param("userId") Long userId,
                                              @Param("pageIndex") Integer pageIndex,
                                              @Param("pageSize") Integer pageSize,
                                              @Param("keywords") List<Long> keywords);

    Integer countByUserId(@Param("userId") Long userId, @Param("keywords") List<Long> keywords);

    @Insert("INSERT INTO tb_exception_record_type(er_id, et_id) " +
            "VALUES(#{exceptionRecordId}, #{exceptionTypeId})")
    void saveERIdAndETId(@Param("exceptionRecordId") Long exceptionRecordId,
                         @Param("exceptionTypeId") Long exceptionTypeId);

    @Delete("DELETE FROM tb_exception_record_type WHERE er_id = #{erId}")
    void removeERIdAndETId(Long erId);
}
