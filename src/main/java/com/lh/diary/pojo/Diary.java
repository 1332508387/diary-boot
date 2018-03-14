package com.lh.diary.pojo;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

/**
 * 日记项，每个日记对应一个 Diary 实例
 *  
 */
@ToString
@Setter
@Getter
@Table(name = "tb_diary")
public class Diary extends BasePojo {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private Long userId;
	
	/** 关联情绪 */
	private Long moodId;
	
	/** 写作日期 */
	private Date writeDate;
	
	/** 日记关键字 */
	private String keyword;
	
	/** 地点位置 */
	private String site;
	
	private String remark;
	
	/** 是否锁定 0、未锁定 1、锁定 */
	private Integer isLock;
	
	/** 状态 0、正常 -1、删除，默认为0 */
	private Integer status = 0;

	/** 日记等级(重要程度)，满分 5 分 */
	private Integer score;
}
