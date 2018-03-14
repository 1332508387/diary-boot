package com.lh.diary.pojo;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 情绪，与 Diary 一对一
 *
 */
@ToString
@Setter
@Getter
@Table(name = "tb_mood")
public class Mood extends BasePojo {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	/** 情绪名称 */
	private String name;
	
	/** 情绪类型 0、积极1、中性2、消极 */
	private Integer type;

	private Integer status;
	
	private String remark;
}
