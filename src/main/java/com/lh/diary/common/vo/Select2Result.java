package com.lh.diary.common.vo;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class Select2Result {
    List<ResultData> results;

    @Getter
    @Setter
    public static class ResultData {
        private Long id;
        private String text;
    }
}
