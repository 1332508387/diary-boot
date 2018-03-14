package com.lh.diary.pojo;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.util.List;

@ToString
@Getter
@Setter
@Data
@Table(name = "tb_exception_record")
public class ExceptionRecord extends BasePojo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    /** 异常堆栈信息 */
    private String exceptionInfo;
    /**  解决方案 */
    private String solution;
    /** 异常类型（所属分类） */
    private String remark;
    @Transient
    private List<ExceptionType> exceptionTypes;
}
