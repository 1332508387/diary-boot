package com.lh.diary.pojo;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

@ToString
@Setter
@Getter
public class BasePojo {
	/** 创建时间 */
	private Date created;
	/** 最后一次修改时间 */
	private Date updated;
}
