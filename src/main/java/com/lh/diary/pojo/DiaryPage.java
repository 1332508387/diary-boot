package com.lh.diary.pojo;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@ToString
@Getter
@Setter
public class DiaryPage extends Page {
    private String startTime;
    private String endTime;
    private Long moodId;
}
